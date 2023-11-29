import { H3Event } from "h3";
import * as url from "url";
import axios from "axios";

const getEnds = () => {
    const currentDate = new Date();
    const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
    const endOfMonth = new Date(startOfNextMonth.getTime() - 1);
    return { endOfDay, endOfMonth };
};

const generateAndSaveToken = async (event: H3Event, brand: string, utkn: string, scn_d: string, scn_m: string) => {
    const { req } = event.node;

    const ip = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || null;
    const userAgent = req.headers["user-agent"]?.toString() || "";

    delete req.headers["content-length"];
    delete req.headers["host"];

    utkn = utkn || "";
    scn_d = scn_d || "";
    scn_m = scn_m || "";
    await axios
        .post(
            `${process.env.API_BASE_URL}/utkn`,
            { ip, userAgent, utkn, brand },
            {
                timeout: 5 * 1000,
                headers: { ...req.headers, "accept-language": "en", "x-forwarded-for": ip, serversecret: process.env.SERVER_SECRET, tt: Date.now() },
            }
        )
        .then((response) => {
            utkn = response.data.token;
            scn_d = response.data.scn_d;
            scn_m = response.data.scn_m;
        })
        .catch((err) => {
            console.log({ err });
        });

    const { endOfDay, endOfMonth } = getEnds();

    if (utkn) setCookie(event, "utkn", utkn, { secure: true, path: "/", maxAge: 2_592_000, httpOnly: true });
    if (scn_d) setCookie(event, "scn_d", scn_d, { secure: true, path: "/", expires: endOfDay, httpOnly: true });
    if (scn_m) setCookie(event, "scn_m", scn_m, { secure: true, path: "/", expires: endOfMonth, httpOnly: true });
};

export default defineEventHandler(async (event) => {
    if (!process.server || event.node.req.url?.includes("/api/") || event.node.req.url?.includes("/file/")) return;

    const pathRay = url.parse(event.node.req.url as string, true).path?.split("/");
    const brandUsername = pathRay?.[1] || "";
    const utkn = getCookie(event, "utkn") || "";
    const scn_d = getCookie(event, "scn_d") || "";
    const scn_m = getCookie(event, "scn_m") || "";

    await generateAndSaveToken(event, brandUsername, utkn, scn_d, scn_m);
});

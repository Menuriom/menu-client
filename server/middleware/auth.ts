import { H3Event } from "h3";
import axios from "axios";

const generateAndSaveToken = async (event: H3Event, utkn: string | null) => {
    const { req } = event.node;

    const ip = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || null;
    const userAgent = req.headers["user-agent"]?.toString() || "";

    delete req.headers["content-length"];
    delete req.headers["host"];

    let token = utkn || "";
    await axios
        .post(
            `${process.env.API_BASE_URL}/utkn`,
            { ip, userAgent, utkn },
            {
                timeout: 5 * 1000,
                headers: { ...req.headers, "accept-language": "en", "x-forwarded-for": ip, serversecret: process.env.SERVER_SECRET, tt: Date.now() },
            }
        )
        .then((response) => {
            token = response.data.token;
        })
        .catch((err) => {
            console.log({ err });
        });

    if (token) setCookie(event, "utkn", token, { secure: true, path: "/", maxAge: 2_592_000 });
};

export default defineEventHandler(async (event) => {
    if (!process.server || event.node.req.url?.includes("/api/")) return;

    const utkn = getCookie(event, "utkn");
    await generateAndSaveToken(event, utkn || null);

    // TODO : make it so that token check not run on every request
});

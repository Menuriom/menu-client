import { H3Event } from "h3";
import axios from "axios";

const generateAndSaveToken = async (event: H3Event, utkn: string | null) => {
    const { req } = event.node;

    const ip = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || null;
    const userAgent = req.headers["user-agent"]?.toString() || "";

    let token = utkn || "";
    await axios
        .post(
            `${process.env.API_BASE_URL}/utkn`,
            { ip, userAgent, utkn },
            {
                timeout: 15 * 1000,
                headers: { ...req.headers, "accept-language": "en", "x-forwarded-for": ip, serversecret: process.env.SERVER_SECRET, tt: Date.now() },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            }
        )
        .then((response) => {
            token = response.data.token;
        })
        .catch((err) => {
            console.log({ err });
        });

    setCookie(event, "utkn", token, { secure: true, path: "/", maxAge: 2_592_000 });
};

export default defineEventHandler(async (event) => {
    if (!process.server || event.node.req.url?.includes("/api/")) return;

    const utkn = getCookie(event, "utkn");
    if (!utkn) await generateAndSaveToken(event, utkn || null);

    // TODO
    // post requests (such as like and comment) should send this token to back
    // back should check if the token exists and if they do continue with request
    // and if the token does not exist or its not valid then remove the token and return 401

    // TODO
    // on every post request update the token in db and in the cookie
});

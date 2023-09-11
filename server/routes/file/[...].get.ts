import http from "http";
import https from "https";

const getFile = (req: http.IncomingMessage, protocol: typeof https | typeof http, baseUrl: string, ip: string | string[] | null): Promise<any> => {
    const headers: any = { ...req.headers, "x-forwarded-for": ip, serversecret: process.env.SERVER_SECRET, tt: Date.now() };
    return new Promise(async (resolve, reject) => {
        protocol.get(`${baseUrl}${req.url}`, { headers: headers }, (response) => {
            if (response.statusCode && response.statusCode >= 200 && response.statusCode < 400) resolve(response);
            else reject(response.statusMessage);
        });
    });
};

export default defineEventHandler(async (event) => {
    const { req, res } = event.node;
    delete req.headers["content-length"];
    delete req.headers["host"];

    const baseUrl: string = process.env.API_BASE_URL || "";
    const protocol = baseUrl.includes("https://") ? https : http;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

    const data = await getFile(req, protocol, baseUrl, ip).catch((e) => {});
    if (!data) {
        res.writeHead(404);
        return res.end();
    }

    return await sendStream(event, data);
});

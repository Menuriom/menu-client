import axios from "axios";
import { H3Event } from "h3";
import { IncomingMessage } from "node:http";
import { checkCsrf } from "./csrf";

export const handleRequest = async (event: H3Event, url: string) => {
    const { req } = event.node;

    const lang = getCookie(event, "i18n_redirected") || "fa";
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    const queries = event.path.indexOf("?") > 0 ? event.path.substring(event.path.indexOf("?"), event.path.length) : "";

    let resStatus = 499;
    let resData = {};

    if (isMethod(event, ["PATCH", "POST", "PUT"]) && !checkCsrf(event, getCookie(event, "XSRF-TOKEN") || "")) {
        resStatus = 419;
        return { resStatus, resData };
    }

    // const data = req.readable ? await read(req) : null;
    const data = isMethod(event, ["PATCH", "POST", "PUT"]) ? await readRawBody(event) : null;

    delete req.headers["content-length"];
    delete req.headers["host"];

    await axios
        .request({
            method: req.method,
            url: `${process.env.API_BASE_URL}${url}${queries}`.replace("/api/v1/", "/"),
            data: data,
            timeout: 15 * 1000,
            headers: { ...req.headers, "accept-language": lang, "x-forwarded-for": ip, serversecret: process.env.SERVER_SECRET, tt: Date.now() },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        })
        .then((response) => {
            resStatus = response.status;
            resData = response.data;
        })
        .catch((error) => {
            if (typeof error.response === "undefined") {
                console.error({ error });
                return;
            }
            resStatus = error.response.status;
            resData = error.response.data;
        });

    return { resStatus, resData };
};

const read = (req: IncomingMessage) => {
    return new Promise((resolve, reject) => {
        let data: Buffer[] = [];
        req.on("data", (chunk) => {
            if (chunk !== null && chunk !== undefined) data.push(Buffer.from(chunk));
        });
        req.on("end", () => resolve(Buffer.concat(data)));
        req.on("error", (e) => reject(e));
    });
};

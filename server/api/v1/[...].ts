import { handleRequest } from "@/server/proxy";

export default defineEventHandler(async (event) => {
    const { resStatus, resData } = await handleRequest(event, event.path);

    if (resStatus === 401) deleteCookie(event, "utkn");

    setResponseStatus(event, resStatus);
    if (process.env.NODE_ENV == "production" && resStatus >= 500) return "Internal Server Error!!!";
    else return resData;
});

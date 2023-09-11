import { handleRequest } from "@/server/proxy";

export default defineEventHandler(async (event) => {
    const { resStatus, resData } = await handleRequest(event, "/api/v1/menu-info/restaurant-info");

    setResponseStatus(event, resStatus);
    if (process.env.NODE_ENV == "production" && resStatus >= 500) return "Internal Server Error!!!";
    else return resData;
});

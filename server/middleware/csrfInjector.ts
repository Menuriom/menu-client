const randStr = (length = 10) => {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export default defineEventHandler(async (event) => {
    // set csrf token in cookie
    const { req, res } = event.node;
    setCookie(event, "XSRF-TOKEN", randStr(64), { secure: true, path: "/" });
});

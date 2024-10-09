require("dotenv").config();

export const PORT = Number(process.env.PORT) || 3000;
export const APP_URL = String(process.env.APP_URL);
export const TELEGRAM_TOKEN = String(process.env.TELEGRAM_TOKEN);

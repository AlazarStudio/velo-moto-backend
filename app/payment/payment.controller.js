import asyncHandler from "express-async-handler";
import axios from "axios";
import qs from "querystring";
import "dotenv/config";

const toKopecks = (rub) => Math.round(Number(rub || 0) * 100);
const getGatewayBase = () =>
  (process.env.ALFA_GATEWAY_URL || "https://payment.alfabank.ru/payment/rest/")
    .replace(/\/+$/, "") + "/";

export const createPayment = asyncHandler(async (req, res) => {
  const { items, fullName, phone, email } = req.body;

  console.log("PAYMENT REQUEST BODY:", req.body); // 👉 лог, что реально приходит

  if (!items || !items.length) {
    return res.status(400).json({
      ok: false,
      source: "server",
      message: "Корзина пуста или items не переданы",
    });
  }

  const gateway = getGatewayBase();
  const { ALFA_USER_NAME, ALFA_PASSWORD, ALFA_RETURN_URL, ALFA_FAIL_URL } =
    process.env;

  if (!ALFA_USER_NAME || !ALFA_PASSWORD) {
    return res.status(500).json({
      ok: false,
      source: "server",
      message: "ALFA_USER_NAME/ALFA_PASSWORD не заданы",
    });
  }

  const totalRub = items.reduce(
    (sum, item) => sum + Number(item.priceForSale || item.price || 0),
    0
  );

  const amount = toKopecks(totalRub);
  const orderNumber = `web-${Date.now()}`;

  const payload = {
    userName: ALFA_USER_NAME,
    password: ALFA_PASSWORD,
    orderNumber,
    amount,
    returnUrl: ALFA_RETURN_URL,
    failUrl: ALFA_FAIL_URL,
    description: `Оплата заказа №${orderNumber}`,
    email,
    phone,
    language: "ru",
  };

  console.log("ALFA payload:", payload);

  try {
    const { data } = await axios.post(
      `${gateway}register.do`,
      qs.stringify(payload),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("ALFA response:", data);

    if (data.errorCode && data.errorCode !== "0") {
      return res.status(400).json({
        ok: false,
        source: "alfa",
        errorCode: data.errorCode,
        errorMessage: data.errorMessage,
      });
    }

    return res.json({
      ok: true,
      formUrl: data.formUrl,
      orderId: data.orderId,
    });
  } catch (err) {
    if (err.response) {
      console.error("ALFA HTTP error:", err.response.status, err.response.data);
      return res.status(502).json({
        ok: false,
        source: "alfa-http",
        status: err.response.status,
        data: err.response.data,
      });
    }

    console.error("createPayment internal error:", err);
    return res
      .status(500)
      .json({ ok: false, source: "server", message: err.message });
  }
});

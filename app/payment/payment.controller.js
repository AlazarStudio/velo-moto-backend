// app/payment/payment.controller.js
import asyncHandler from "express-async-handler";
import axios from "axios";
import qs from "querystring";
import "dotenv/config"; // чтобы .env точно подхватился и в этом модуле

// конвертация рублей → копейки
const toKopecks = (rub) => Math.round(Number(rub || 0) * 100);

const getGatewayBase = () => {
  const base =
    process.env.ALFA_GATEWAY_URL ||
    "https://payment.alfabank.ru/payment/rest/"; // боевой URL Альфы 

  // гарантируем один слэш в конце
  return base.replace(/\/+$/, "") + "/";
};

export const createPayment = asyncHandler(async (req, res) => {
  const { items, fullName, phone, email } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ ok: false, message: "Корзина пуста" });
  }

  const gateway = getGatewayBase();
  const {
    ALFA_USER_NAME,
    ALFA_PASSWORD,
    ALFA_RETURN_URL,
    ALFA_FAIL_URL,
  } = process.env;

	console.log(ALFA_USER_NAME)
	console.log(ALFA_PASSWORD)
	console.log(ALFA_RETURN_URL)
	console.log(ALFA_FAIL_URL)

  if (!ALFA_USER_NAME || !ALFA_PASSWORD) {
    return res.status(500).json({
      ok: false,
      message: "ALFA_USER_NAME/ALFA_PASSWORD не заданы на сервере",
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

  try {
    const { data } = await axios.post(
      `${gateway}register.do`,
      qs.stringify(payload),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    // Банк ответил 200, но внутри есть errorCode
    if (data.errorCode && data.errorCode !== "0") {
      console.error("ALFA register error:", data);
      return res.status(400).json({
        ok: false,
        source: "alfa",
        errorCode: data.errorCode,
        errorMessage: data.errorMessage,
        raw: data,
      });
    }

    return res.json({
      ok: true,
      formUrl: data.formUrl,
      orderId: data.orderId,
    });
  } catch (err) {
    // Ошибка HTTP от Альфы
    if (err.response) {
      console.error(
        "ALFA HTTP error:",
        err.response.status,
        err.response.data
      );
      return res.status(502).json({
        ok: false,
        source: "alfa-http",
        status: err.response.status,
        data: err.response.data,
      });
    }

    // Внутренняя ошибка (URL, сеть и т.п.)
    console.error("createPayment internal error:", err);
    return res.status(500).json({
      ok: false,
      source: "server",
      message: err.message,
    });
  }
});

import asyncHandler from "express-async-handler";
import axios from "axios";
import qs from "querystring";
import "dotenv/config";

const GATEWAY_URL =
  "https://payment.alfabank.ru/payment/rest/register.do"; // тот же, что ты руками проверял

const toKopecks = (rub) => Math.round(Number(rub || 0) * 100);

export const createPayment = asyncHandler(async (req, res) => {
  const { items, fullName, phone, email } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({
      ok: false,
      message: "Корзина пуста или items не переданы",
    });
  }

  const { ALFA_USER_NAME, ALFA_PASSWORD, ALFA_RETURN_URL, ALFA_FAIL_URL } =
    process.env;

  const totalRub = items.reduce(
    (sum, item) => sum + Number(item.priceForSale || item.price || 0),
    0
  );
  const amount = toKopecks(totalRub);
  const orderNumber = `web-site-${Date.now()}`;

  const payload = {
    userName: ALFA_USER_NAME,       // r-velomotodrive_kchr-api
    password: ALFA_PASSWORD,        // sWE8JzBJ5shs!h
    amount,
    orderNumber,
    returnUrl: ALFA_RETURN_URL || "https://velomotodrive-kchr.ru/shopping-cart",
    failUrl: ALFA_FAIL_URL  || "https://velomotodrive-kchr.ru/shopping-cart",
    description: `Оплата заказа №${orderNumber}`,
    email,
    phone,
    language: "ru",
  };

  console.log("ALFA payload:", payload);

  // Делаем GET с такими же параметрами, как ты пробовал в браузере
  const { data } = await axios.get(GATEWAY_URL, { params: payload });

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
});

// app/payment/payment.controller.js
import asyncHandler from "express-async-handler";
import axios from "axios";
import qs from "querystring";

const {
  ALFA_GATEWAY_URL,
  ALFA_USER_NAME,
  ALFA_PASSWORD,
  ALFA_RETURN_URL,
  ALFA_FAIL_URL,
} = process.env;

const toKopecks = (rub) => Math.round(Number(rub || 0) * 100);
console.log(ALFA_GATEWAY_URL)
console.log(ALFA_USER_NAME)
console.log(ALFA_PASSWORD)
console.log(ALFA_RETURN_URL)
console.log(ALFA_FAIL_URL)

export const createPayment = asyncHandler(async (req, res) => {
  const { items, fullName, phone, email } = req.body;

  if (!items || !items.length) {
    res.status(400);
    throw new Error("Корзина пуста");
  }

  // считаем сумму по корзине (в рублях)
  const totalRub = items.reduce(
    (sum, item) => sum + Number(item.priceForSale || item.price || 0),
    0
  );

  const amount = toKopecks(totalRub); // в копейках
  const orderNumber = `web-${Date.now()}`; // любой уникальный номер заказа

  // если нужно — здесь можешь сохранить заказ в БД через prisma
  // и привязать к нему orderNumber

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
	console.log(payload)

  const { data } = await axios.post(
    `${ALFA_GATEWAY_URL}register.do`,
    qs.stringify(payload),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  if (data.errorCode && data.errorCode !== "0") {
    console.error("Alfa error:", data);
    res.status(502);
    throw new Error(data.errorMessage || "Ошибка платёжного шлюза");
  }

  // frontend дальше делает window.location.href = formUrl
  res.json({
    formUrl: data.formUrl,
    orderId: data.orderId,
  });
});

import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import { errorHandler, notFound } from "./app/middleware/error.middleware.js";
import { prisma } from "./app/prisma.js";

import authRoutes from "./app/auth/auth.routes.js";
import userRoutes from "./app/user/user.routes.js";

import itemRoutes from "./app/item/item.routes.js";
import groupRoutes from "./app/group/group.routes.js";

import receiptRoutes from "./app/receipt/receipt.routes.js";
import saleRoutes from "./app/sale/sale.routes.js";
import writeOffRoutes from "./app/writeoff/writeoff.routes.js";
import reportRoutes from "./app/report/report.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Допустимые типы файлов
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 8 }, // Ограничение размера файла 8MB
  fileFilter: fileFilter,
});

app.use(cors());

async function main() {
  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

  app.use(express.json());

  const __dirname = path.resolve();

  app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
      console.log("File received:", req.file);
      res.json({ filePath: `/uploads/${req.file.filename}` });
    } catch (error) {
      console.error("Error during file upload:", error);
      res.status(500).send("Error uploading file");
    }
  });

  app.use("/uploads", express.static(path.join(__dirname, "/uploads/")));

  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);

  app.use("/api/items", itemRoutes);
  app.use("/api/groups", groupRoutes);

  app.use("/api/receipts", receiptRoutes);
  app.use("/api/sales", saleRoutes);
  app.use("/api/writeoffs", writeOffRoutes);
  app.use("/api/reports", reportRoutes);

  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

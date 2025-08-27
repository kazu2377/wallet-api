// パッケージのインポート
import dotenv from "dotenv";
import express from "express";
import job from "./config/cron.js";
import { initDB, sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
// 環境変数の読み込み
dotenv.config();

// Expressアプリケーションのインスタンスを作成
const app = express();
const PORT = process.env.PORT || 5001; // ポート番号を環境変数から取得、なければ5001を使用

if (process.env.NODE_ENV === "production") job.start(); // Start the cron job

app.use(rateLimiter);
app.use(express.json());

app.use((req, res, next) => {
  console.log("ミドルウェア", req.method);
  next();
});

// ルートエンドポイントの作成
app.get("/", (req, res) => {
  try {
    // データベースからデータを取得する例
    // const [result] = await sql`SELECT NOW();`;
    // res.json({ message: "Hello, World!", databaseTime: result.now });

    res.send("Server is up and runningtokyo");
  } catch (error) {
    // console.error("Error fetching from database:", error);
    // res.status(500).send("Internal Server Error");
  }
});

console.log(process.env.PORT);

// サーバーの起動
// app.listen(PORT, () => {
//   console.log(`Server is up and running on PORT:${PORT}`);
// });

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    console.log("Received transaction data:", req.body);

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // ここにデータベースへの挿入ロジックを追加します
    const transaction =
      await sql`INSERT INTO transactions (user_id, title, category, amount) VALUES (${user_id}, ${title}, ${category}, ${amount}) RETURNING *`;
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

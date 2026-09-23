import "dotenv/config";
import app from "./app.js";
import connectDB from "./src/db/index.js";

const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is listening on port ${process.env.PORT}...\n`);
  });
};

startServer();
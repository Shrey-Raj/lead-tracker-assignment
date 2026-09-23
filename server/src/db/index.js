import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`,
      {
        dbName: process.env.DATABASE_NAME, 
      }
    );
    console.log(
      `☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("\n 💀MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log('> Using MONGO_URI:', process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Database Connected");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB Connection Error:", err);
    });

  } catch (error) {
    console.error("Database Connection Failed:", error);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB;
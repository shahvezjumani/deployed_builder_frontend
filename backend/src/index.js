import app from "./app.js";
import connectDB from "./DB/index.js";
import dotenv from "dotenv";
dotenv.config();

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error(`error ${error}`);
      throw error;
    });
    app.listen(process.env.PORT || 3000, () => {
      // heart and emoji is just for fun don't mind great engineers
      console.log(`😁Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(`MONGODB Connection Failed ${error}`);
  });

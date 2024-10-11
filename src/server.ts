import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";
import Logger from "./utils/logger";

const logger = new Logger("server");

async function bootstrap() {
  try {
    await mongoose.connect(process.env.DATABASE_URL ?? "");
    logger.log("datasource initialized", { name: "rubbers-api" });
  } catch (err) {
    logger.error("unable to initialize datasource", {
      name: "rubbers-api",
      reason: err,
    });
  }

  const PORT = process.env.PORT || 2001;
  const server = app.listen(PORT, () => {
    logger.log(`rubbers-api is running`, { PORT });
  });

}
bootstrap();
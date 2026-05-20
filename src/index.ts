import app from "./app";
import config from "./config";
import { initDB } from "./db";

const main = async () => {
  initDB();
  app.listen(config.port, () => {
    console.log(`Server Is Running On Port ${config.port}`);
  });
};

main();

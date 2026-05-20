import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { logger } from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";
import authRoutes from "./api/routes/auth.route";

const app: Application = express();
app.use(express.json());
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.use("/api", authRoutes);

app.use(globalErrorHandler);
export default app;

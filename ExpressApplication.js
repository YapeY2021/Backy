import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

// routes import
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import { eventRouter } from "./routes/eventRoutes.js";

class ExpressApplication {
  constructor(container) {
    this.app = {};
    this.container = container;
  }

  createExpressApp() {
    // injects environment variables into our application
    dotenv.config();

    // creates a server application
    this.app = express();

    // json body parser middleware
    app.use(express.json());

    // we use morgan to log all the incoming request
    app.use(morgan("dev"));

    // all routes
    app.use("/api/users", this.container.UserRoute);
    app.use("/api/events", eventRouter);

    app.get("/", async (req, res) => {
      res.status(200).send("Welcome to the donnchad world.");
    });

    // middlewares
    app.use(notFound);
    app.use(errorHandler);

    return app;
  }
}

export default ExpressApplication;

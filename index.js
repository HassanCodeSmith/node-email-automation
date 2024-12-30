/** __________ All Imports __________ */
import "express-async-errors";
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import https from "https";
import http from "http";
import cors from "cors";

import { ConnectDb } from "./src/config/db.config.js";
import { notFound } from "./src/middlewares/notFound.middleware.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";
import { router } from "./src/routes/index.routes.js";

/** __________ Dot Env Configuration __________ */
dotenv.config();

/** __________ Express Instance __________ */
const app = express();

/** __________ SET PORT __________ */
app.set("PORT", process.env.PORT || 8000);

/** __________ Middlewares __________ */
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

/** __________ Testing Route __________ */
app.route("/").get((req, res) => {
  return res.send(
    "<h1 style='display: flex; justify-content: center;  align-items: center; font-size:9rem; margin-top:10rem;'>Server is running.</h1>"
  );
});

/** Routes */
app.use("/api/v1", router);

/** __________ Error Handling Middlewares __________ */
app.use(notFound);
app.use(errorHandler);

/** __________ Server Setup __________ */
let server;
if (process.env.NODE_ENV === "PRODUCTION") {
  /** __________ Replace with your code following is sample code __________ */
  //   const options = {
  //     key: fs.readFileSync("/etc/letsencrypt/live/marsa-app.com/privkey.pem"),
  //     cert: fs.readFileSync("/etc/letsencrypt/live/marsa-app.com/fullchain.pem"),
  //   };
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

/** __________ Server Listing & DB Connection __________ */
(async () => {
  try {
    await ConnectDb();
    server.listen(app.get("PORT"), () => {
      console.info("==> 🌎 Go to http://localhost:%s", app.get("PORT"));
    });
  } catch (error) {
    console.error("An error occurred while running server", error);
  }
})();

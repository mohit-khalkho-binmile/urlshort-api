/* 
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
import { json } from 'body-parser';
import express, { Application } from 'express';
import cluster from 'cluster';
import os from "os";
import mongoose, { ConnectOptions } from "mongoose";
import router from "./routes";
import cors from "cors";
const { MONGO_DEV_URI, PORT, ALLOW_ORIGIN }:any = process.env
const app: Application = express();
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./swaggerOption";
import useragent from 'express-useragent';
app.use(json())
app.use(useragent.express());


let corsOptionsDelegate = function (req:any, callback:any) {
  var corsOptions;
  if (ALLOW_ORIGIN.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate));
const specs = swaggerJsDoc(options);
app.get("/docs/swagger.json", (req, res) => res.json(specs));
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs)); 
app.use(router);
  mongoose.connect(MONGO_DEV_URI as string,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions).then(()=> console.log('database connected')).catch((err)=> console.log(err));

  app.listen(PORT, (): void => {
    console.log(`process ${process.pid} Server Running here 👉 http://localhost:${PORT}`);
  });
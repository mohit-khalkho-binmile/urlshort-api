/* 
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
import dotenv from "dotenv";
dotenv.config();
const envVars = process.env;

export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Adani URL Shortening",
      version: "1.0.0",
      description: "List of all URL Shortening APIs",
    },
    host: envVars.LIVE_URL ? envVars.LIVE_URL : `localhost:${envVars.PORT}`,
    basePath: "/",
    produces: ["application/json", "application/xml"],
    schemes: [envVars.SWAGGER_SCHEMES ? envVars.SWAGGER_SCHEMES : "http"],
  },
  basedir: __dirname, // app absolute path
  apis: ["./src/routes/*.ts"],
};
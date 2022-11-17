"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
/*
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envVars = process.env;
exports.options = {
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
    basedir: __dirname,
    apis: ["./src/routes/*.ts"],
};

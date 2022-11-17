"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
const body_parser_1 = require("body-parser");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const { MONGO_DEV_URI, PORT, ALLOW_ORIGIN } = process.env;
const app = (0, express_1.default)();
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOption_1 = require("./swaggerOption");
const express_useragent_1 = __importDefault(require("express-useragent"));
app.use((0, body_parser_1.json)());
app.use(express_useragent_1.default.express());
let corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (ALLOW_ORIGIN.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    }
    else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use((0, cors_1.default)(corsOptionsDelegate));
const specs = (0, swagger_jsdoc_1.default)(swaggerOption_1.options);
app.get("/docs/swagger.json", (req, res) => res.json(specs));
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use(routes_1.default);
mongoose_1.default.connect(MONGO_DEV_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('database connected')).catch((err) => console.log(err));
app.listen(PORT, () => {
    console.log(`process ${process.pid} Server Running here 👉 http://localhost:${PORT}`);
});

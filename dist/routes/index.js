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
const express_1 = __importDefault(require("express"));
const shortUrlRoutes_1 = __importDefault(require("./shortUrlRoutes"));
const originRoutes_1 = __importDefault(require("./originRoutes"));
const router = express_1.default.Router();
router.use([
    shortUrlRoutes_1.default,
    originRoutes_1.default,
]);
exports.default = router;

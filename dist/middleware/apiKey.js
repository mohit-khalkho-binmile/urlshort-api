"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const origin_1 = require("../models/origin");
const apiKeyAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let keyObj = req.headers['x-adani-key'];
    if (!req.headers['x-adani-key']) {
        return res.status(400).send({
            message: "Please provide x-adani-key header"
        });
    }
    else {
        const allowData = yield origin_1.Origin.find({ $and: [{ keyId: keyObj.split(':')[0] }, { secretKey: keyObj.split(':')[1] }, { applicationUrl: req.headers.origin }] });
        if (allowData.length > 0)
            next();
        else {
            return res.status(400).send({
                message: "Invalid key header and origin details"
            });
        }
    }
});
exports.default = apiKeyAuth;

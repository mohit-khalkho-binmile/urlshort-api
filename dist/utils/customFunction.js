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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKeyidSecretkey = exports.addUtmSource = exports.checkProperties = void 0;
/*
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
const moment_1 = __importDefault(require("moment"));
const ts_md5_1 = require("ts-md5");
const uuid_1 = require("uuid");
const LOANG_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
/**
 *
 *@param {Check key Value Pair Exist or not} obj
 */
function checkProperties(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        let validObj = {};
        return new Promise(function (resolve, reject) {
            for (var key in obj) {
                // console.log(key);
                if (obj[key] !== null &&
                    obj[key] !== "" &&
                    typeof obj[key] !== "undefined") {
                }
                else {
                    validObj.status = false;
                    validObj.message = key + " value Required";
                    return resolve(validObj);
                }
                //if (obj[key] !== null && obj[key] != "")
            }
            validObj.status = true;
            validObj.message = "Success";
            resolve(validObj);
        });
    });
}
exports.checkProperties = checkProperties;
/**
 *
 * @param shortUrlData
 * @returns utm url
 */
function addUtmSource(shortUrl) {
    let url = shortUrl.longUrl;
    if (url.includes("?")) {
        if (url.includes("utm_source") && url.includes("utm_medium")) {
            url = shortUrl.longUrl;
        }
        else if (!url.includes("utm_source") && !url.includes("utm_medium")) {
            url = url + `&utm_source=${shortUrl.source}&utm_medium=${shortUrl.medium}`;
        }
        else if (!url.includes("utm_medium")) {
            url = url + `&utm_medium=${shortUrl.medium}`;
        }
        else if (!url.includes("utm_source")) {
            url = url + `&utm_source=${shortUrl.source}`;
        }
        else {
            url = url + `&utm_source=${shortUrl.source}&utm_medium=${shortUrl.medium}`;
        }
    }
    else {
        url = url + `?utm_source=${shortUrl.source}&utm_medium=${shortUrl.medium}`;
    }
    return url;
}
exports.addUtmSource = addUtmSource;
/**
 * @description: to create keyId and secretKey
 * @returns both keys
 */
function createKeyidSecretkey() {
    return new Promise(function (resolve, reject) {
        const hashString = (source) => ts_md5_1.Md5.hashStr(source, false);
        const rString = randomString(32, LOANG_STRING);
        const secretkey = hashString(rString + (0, moment_1.default)().unix());
        const obj = {
            keyid: (0, uuid_1.v4)(),
            secretkey: secretkey
        };
        resolve(obj);
    });
}
exports.createKeyidSecretkey = createKeyidSecretkey;
function randomString(length, chars) {
    var result = '';
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

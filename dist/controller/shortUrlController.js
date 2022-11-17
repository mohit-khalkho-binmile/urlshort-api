"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteShortUrl = exports.getUTMtypes = exports.searchShortUrl = exports.editShortUrl = exports.getIsAvailableShortId = exports.addSmartUrl = exports.CreateShortUrl = exports.resolveLongURlByShortId = exports.getShortURlById = exports.getAllShortUrls = void 0;
const http_status_1 = __importDefault(require("http-status"));
const shortUrl_1 = require("../models/shortUrl");
const shortId = __importStar(require("shortid"));
const dotenv_1 = __importDefault(require("dotenv"));
const customFunction_1 = require("../utils/customFunction");
dotenv_1.default.config();
const { SHORT_BASE_URL, } = process.env;
function getAllShortUrls(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { offset = 0, limit = 20 } = req.query;
            const totalCount = yield shortUrl_1.ShortUrl.find().count();
            const shortUrls = yield shortUrl_1.ShortUrl.find().sort({ updateOn: -1 }).skip(offset).limit(limit);
            return res.status(http_status_1.default.OK).send({
                data: shortUrls,
                totalCount: totalCount
            });
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
        }
    });
}
exports.getAllShortUrls = getAllShortUrls;
function getShortURlById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const shortUrlId = req.params.shortid;
            const shortUrl = yield shortUrl_1.ShortUrl.findOne({ shortUrlId: shortUrlId });
            if (!shortUrl)
                return res.sendStatus(404);
            return res.status(http_status_1.default.OK).send(shortUrl);
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
        }
    });
}
exports.getShortURlById = getShortURlById;
function resolveLongURlByShortId(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const shortUrlId = req.params.shortid;
            const shortUrl = yield shortUrl_1.ShortUrl.findOne({ shortUrlId: shortUrlId });
            if (!shortUrl)
                return res.sendStatus(404);
            let longUrl = (0, customFunction_1.addUtmSource)(shortUrl);
            let userAgent = req.useragent ? req.useragent.platform : 'unknown';
            //userAgent = 'Linux';
            if (userAgent) {
                if (shortUrl.isSmartUrl) {
                    let devices = JSON.parse(shortUrl === null || shortUrl === void 0 ? void 0 : shortUrl.smartUrlDetails);
                    let result = devices.filter((item) => userAgent.includes(item.device));
                    if (result.length > 0) {
                        longUrl = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.device_url;
                    }
                }
                if (userAgent) {
                    //userAgent = (userAgent == 'unknown') ? 'others' : userAgent;
                    let checkDeviceExists = shortUrl.clickDetails.filter((item) => userAgent.includes(item.deviceType));
                    if (checkDeviceExists.length == 0) {
                        const obj = {
                            deviceType: userAgent,
                            click: 1
                        };
                        shortUrl.clickDetails.push(obj);
                    }
                    else {
                        yield shortUrl_1.ShortUrl.updateOne({ _id: shortUrl._id, "clickDetails.deviceType": userAgent }, { $inc: { "clickDetails.$.click": 1 } });
                    }
                }
            }
            shortUrl.clickCount++;
            shortUrl.save();
            res.redirect(longUrl);
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
        }
    });
}
exports.resolveLongURlByShortId = resolveLongURlByShortId;
function CreateShortUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            let fieldData = {};
            fieldData.longUrl = data.longUrl;
            fieldData.urlName = data.urlName;
            fieldData.userName = data.userName;
            fieldData.email = data.email;
            let IsValidated = yield (0, customFunction_1.checkProperties)(fieldData);
            if (IsValidated && IsValidated.status === true) {
                let shortUrlId = shortId.generate();
                let shortUrl = `${SHORT_BASE_URL}/${shortUrlId}`;
                fieldData.shortUrlId = shortUrlId;
                fieldData.shortUrl = shortUrl;
                fieldData.medium = data === null || data === void 0 ? void 0 : data.medium;
                fieldData.source = data === null || data === void 0 ? void 0 : data.source;
                fieldData.createdBy = fieldData.userName;
                fieldData.updatedBy = fieldData.userName;
                const response = yield shortUrl_1.ShortUrl.create(fieldData);
                return res.status(http_status_1.default.OK).send(response);
            }
            else {
                return res.status(http_status_1.default.BAD_REQUEST).send(IsValidated.message);
            }
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
        }
    });
}
exports.CreateShortUrl = CreateShortUrl;
function addSmartUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const shortUrlId = req.body.shortUrlId;
            const data = req.body;
            let fieldData = {};
            fieldData.shortUrlId = data.shortUrlId;
            fieldData.smartUrl = data.smartUrl;
            let IsValidated = yield (0, customFunction_1.checkProperties)(fieldData);
            if (IsValidated && IsValidated.status === true) {
                if (Array.isArray(data.smartUrl) != true) {
                    return res.status(http_status_1.default.BAD_REQUEST).send("Smart Url should be an Array");
                }
                else {
                    if (data.smartUrl.length == 0) {
                        return res.status(http_status_1.default.BAD_REQUEST).send("Please fill Smart Url Details.");
                    }
                    if (data.smartUrl.length > 0 && Object.keys(data.smartUrl[0]).length == 0) {
                        return res.status(http_status_1.default.BAD_REQUEST).send("Please fill Smart Url Details.");
                    }
                    const smartUrls = data.smartUrl;
                    let smartUrlDetails = JSON.stringify(smartUrls);
                    const shortUrl = yield shortUrl_1.ShortUrl.findOne({ shortUrlId: shortUrlId });
                    if (!shortUrl)
                        return res.sendStatus(http_status_1.default.NOT_FOUND);
                    shortUrl.isSmartUrl = true;
                    shortUrl.smartUrlDetails = smartUrlDetails;
                    shortUrl.updateOn = new Date();
                    shortUrl.updatedBy = data.updatedBy;
                    shortUrl.save();
                    return res.status(http_status_1.default.OK).send('Success');
                }
            }
            else {
                return res.status(http_status_1.default.BAD_REQUEST).send(IsValidated.message);
            }
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
        }
    });
}
exports.addSmartUrl = addSmartUrl;
function getIsAvailableShortId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const shortUrlId = req.params.shortid;
            const shortUrlData = yield shortUrl_1.ShortUrl.findOne({ shortUrlId: shortUrlId });
            const isAvailableObj = {
                isAvailable: false,
            };
            if (!shortUrlData) {
                isAvailableObj.isAvailable = true;
            }
            return res.status(http_status_1.default.OK).send(isAvailableObj);
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
        }
    });
}
exports.getIsAvailableShortId = getIsAvailableShortId;
function editShortUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            let id = data._id;
            let requiredField = {};
            requiredField._id = id;
            requiredField.urlName = data.urlName;
            requiredField.longUrl = data.longUrl;
            requiredField.shortUrlId = data.shortUrlId;
            requiredField.isSmartUrl = data.isSmartUrl;
            let checkData = yield (0, customFunction_1.checkProperties)(requiredField);
            if (checkData && checkData.status == true) {
                // if smarturl is true then it should have smarturlsdetails value
                if (data.isSmartUrl == true && Array.isArray(data.smartUrl) != true) {
                    return res.status(http_status_1.default.BAD_REQUEST).send("Smart Url should be an Array");
                }
                if (data.isSmartUrl == true && data.smartUrl.length == 0) {
                    return res.status(http_status_1.default.BAD_REQUEST).send("Please fill Smart Url Details.");
                }
                if (data.isSmartUrl == true && data.smartUrl.length > 0 && Object.keys(data.smartUrl[0]).length == 0) {
                    return res.status(http_status_1.default.BAD_REQUEST).send("Please fill Smart Url Details.");
                }
                let smartUrlDetails = (data.isSmartUrl == true) ? JSON.stringify(data.smartUrl) : null;
                let shortUrl = `${SHORT_BASE_URL}/${data.shortUrlId}`;
                const shortUrlUpdate = yield shortUrl_1.ShortUrl.updateOne({ _id: id }, { urlName: data.urlName, longUrl: data.longUrl,
                    shortUrlId: data.shortUrlId, shortUrl: shortUrl, isSmartUrl: data.isSmartUrl, smartUrlDetails: smartUrlDetails, updateOn: Date.now(), updatedBy: data.updatedBy });
                if (shortUrlUpdate.acknowledged == true && shortUrlUpdate.modifiedCount == 1) {
                    return res.status(http_status_1.default.OK).send("Record Updated Succesfully");
                }
                else {
                    return res.status(http_status_1.default.OK).send("Nothing To Update");
                }
            }
            else {
                return res.status(http_status_1.default.BAD_REQUEST).send(checkData.message);
            }
        }
        catch (error) {
            console.error("error==", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
        }
    });
}
exports.editShortUrl = editShortUrl;
function searchShortUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { fromDate, toDate, source, medium, isSmartUrl, search, offset = 0, limit = 10 } = req.body;
            let query = {};
            if (fromDate || toDate) {
                if (fromDate && toDate) {
                    toDate = new Date(toDate);
                    toDate = toDate.toISOString();
                    fromDate = new Date(fromDate);
                    fromDate = fromDate.toISOString();
                    if (fromDate != toDate) {
                        toDate = new Date(toDate);
                        toDate.setHours(23, 59, 59, 999);
                        toDate = toDate.toISOString();
                        query['createdOn'] = {
                            '$gte': new Date(fromDate),
                            '$lte': new Date(toDate)
                        };
                    }
                    else {
                        fromDate = new Date(fromDate);
                        fromDate.setSeconds(0);
                        fromDate.setHours(0);
                        fromDate.setMinutes(0);
                        fromDate = fromDate.toISOString();
                        toDate = new Date(toDate);
                        toDate.setHours(23);
                        toDate.setMinutes(59);
                        toDate.setSeconds(59);
                        toDate = toDate.toISOString();
                        query['createdOn'] = {
                            '$gte': new Date(fromDate),
                            '$lte': new Date(toDate)
                        };
                    }
                }
                else if (toDate) {
                    toDate = new Date(toDate);
                    toDate = toDate.toISOString();
                    query['createdOn'] = {
                        '$lte': new Date(toDate)
                    };
                }
                else {
                    query['createdOn'] = {
                        '$gte': new Date(fromDate)
                    };
                }
            }
            if (source || medium || isSmartUrl || search) {
                query['$and'] = [];
                if (source) {
                    query['$and'].push({
                        source: new RegExp(source, "i")
                    });
                }
                if (medium) {
                    query['$and'].push({
                        medium: new RegExp(medium, "i")
                    });
                }
                if (isSmartUrl) {
                    query['$and'].push({
                        isSmartUrl: true
                    });
                }
                if (search) {
                    let regex = new RegExp(search, 'i');
                    query['$and'].push({
                        '$or': [{ shortUrl: regex }, { urlName: regex }]
                    });
                }
            }
            const data = yield shortUrl_1.ShortUrl.find(query).sort({ updateOn: -1 }).skip(offset).limit(limit);
            const totalCount = yield shortUrl_1.ShortUrl.find(query).count();
            return res.status(http_status_1.default.OK).send({
                data: data,
                totalCount: totalCount
            });
        }
        catch (err) {
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(err);
        }
    });
}
exports.searchShortUrl = searchShortUrl;
function getUTMtypes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let pipeline = [
                {
                    "$group": {
                        "_id": {
                            source: "$source",
                            medium: "$medium"
                        }
                    }
                },
                {
                    "$project": {
                        _id: 0, source: '$_id.source', medium: '$_id.medium'
                    }
                }
            ];
            const data = yield shortUrl_1.ShortUrl.aggregate(pipeline);
            let result = {};
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                for (let key in item) {
                    if (!(key in result))
                        result[key] = [];
                    result[key].push(item[key]);
                }
            }
            return res.status(http_status_1.default.OK).send(result);
        }
        catch (err) {
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(err);
        }
    });
}
exports.getUTMtypes = getUTMtypes;
function deleteShortUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const deleteResponse = yield shortUrl_1.ShortUrl.deleteOne({ _id: id });
            return res.status(http_status_1.default.OK).send(deleteResponse);
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
        }
    });
}
exports.deleteShortUrl = deleteShortUrl;

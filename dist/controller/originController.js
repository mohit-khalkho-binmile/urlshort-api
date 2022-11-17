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
exports.getOrigins = exports.deleteorigin = exports.deleteOrigin = exports.editOrigin = exports.createOrigin = void 0;
const http_status_1 = __importDefault(require("http-status"));
const origin_1 = require("../models/origin");
const dotenv_1 = __importDefault(require("dotenv"));
const customFunction_1 = require("../utils/customFunction");
dotenv_1.default.config();
const { SHORT_BASE_URL, } = process.env;
function createOrigin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            let fieldData = {};
            const key = yield (0, customFunction_1.createKeyidSecretkey)();
            fieldData.applicationUrl = data.applicationUrl;
            fieldData.applicationName = data.applicationName;
            fieldData.createdBy = data.createdBy;
            let IsValidated = yield (0, customFunction_1.checkProperties)(fieldData);
            if (IsValidated && IsValidated.status === true) {
                fieldData.keyId = key.keyid;
                fieldData.secretKey = key.secretkey;
                fieldData.isActive = true;
                const responseData = yield origin_1.Origin.findOne({ "$or": [
                        { applicationName: fieldData.applicationName, isActive: fieldData.isActive, },
                        { applicationUrl: fieldData.applicationUrl, isActive: fieldData.isActive, },
                    ] });
                if (responseData) {
                    let errMessage = '';
                    if ((responseData.applicationName === fieldData.applicationName) && (responseData.applicationUrl === fieldData.applicationUrl)) {
                        errMessage = 'Application name and Application url';
                    }
                    else if (responseData.applicationUrl === fieldData.applicationUrl) {
                        errMessage = 'Application url';
                    }
                    else if (responseData.applicationName === fieldData.applicationName) {
                        errMessage = 'Application name';
                    }
                    if (responseData.applicationName || responseData.applicationUrl) {
                        return res.status(http_status_1.default.OK).send({
                            message: `${errMessage} already exist in database.`,
                            status: false,
                            data: {}
                        });
                    }
                }
                const response = yield origin_1.Origin.create(fieldData);
                const responseObj = {
                    message: 'Application URL successfully created.',
                    status: true,
                    data: response,
                };
                if (response) {
                    return res.status(http_status_1.default.OK).send(responseObj);
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
exports.createOrigin = createOrigin;
function editOrigin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            let id = data._id;
            let fieldData = {};
            fieldData._id = id;
            fieldData.updateBy = data.updateBy;
            let IsValidated = yield (0, customFunction_1.checkProperties)(fieldData);
            if (IsValidated && IsValidated.status === true) {
                fieldData.isActive = true;
                const key = yield (0, customFunction_1.createKeyidSecretkey)();
                fieldData.secretKey = key.secretkey;
                const originUpdate = yield origin_1.Origin.updateOne({ _id: id }, { keyId: key.keyid, secretKey: key.secretkey, updateBy: fieldData.updateBy, updateOn: new Date(), isActive: fieldData.isActive });
                if (originUpdate.acknowledged == true && originUpdate.modifiedCount == 1) {
                    const responseObj = {};
                    responseObj.message = "Record Updated Succesfully";
                    responseObj.keyId = key.keyid;
                    responseObj.secretKey = key.secretkey;
                    return res.status(http_status_1.default.OK).send(responseObj);
                }
                else {
                    return res.status(http_status_1.default.OK).send("Nothing To Update");
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
exports.editOrigin = editOrigin;
function deleteOrigin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const deleteResponse = yield origin_1.Origin.deleteOne({ _id: id });
            return res.status(http_status_1.default.OK).send("Record deleted Succesfully");
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
        }
    });
}
exports.deleteOrigin = deleteOrigin;
function deleteorigin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            if (!id)
                return res.status(http_status_1.default.OK).send("Required record id");
            const deleteResponse = yield origin_1.Origin.deleteOne({ _id: id });
            return res.status(http_status_1.default.OK).send(deleteResponse.deletedCount ? 'Record deleted Succesfully' : 'Record Not Found');
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
        }
    });
}
exports.deleteorigin = deleteorigin;
function getOrigins(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { offset = 0, limit = 10 } = req.query;
            const totalCount = yield origin_1.Origin.find().count();
            const allOrigins = yield origin_1.Origin.find().skip(offset).limit(limit);
            return res.status(http_status_1.default.OK).send({
                data: allOrigins,
                totalCount: totalCount
            });
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
        }
    });
}
exports.getOrigins = getOrigins;

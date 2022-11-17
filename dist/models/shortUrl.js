"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortUrl = void 0;
/*
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
const mongoose_1 = require("mongoose");
const clickDetails = new mongoose_1.Schema({
    deviceType: {
        type: String,
        default: null
    },
    click: {
        type: Number,
        default: 0
    }
}, { _id: false });
const shortUrlSchema = new mongoose_1.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrlId: {
        type: String,
        required: true,
        unique: true
    },
    shortUrl: {
        type: String,
        required: true,
    },
    clickCount: {
        type: Number,
        required: true,
        default: 0
    },
    clickDetails: {
        type: [clickDetails],
        default: null
    },
    urlName: {
        type: String,
        required: true
    },
    medium: {
        type: String,
        default: null
    },
    source: {
        type: String,
        default: null
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updateOn: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        default: null
    },
    updatedBy: {
        type: String,
        default: null
    },
    isSmartUrl: {
        type: Boolean,
        default: false
    },
    smartUrlDetails: {
        type: String,
        default: null
    },
    userName: {
        type: String
    },
    email: {
        type: String,
    }
});
const ShortUrl = (0, mongoose_1.model)('ShortUrl', shortUrlSchema);
exports.ShortUrl = ShortUrl;

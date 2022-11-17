"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Origin = void 0;
/*
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
const mongoose_1 = require("mongoose");
const originSchema = new mongoose_1.Schema({
    applicationUrl: {
        type: String,
        required: true
    },
    applicationName: {
        type: String,
        required: true
    },
    keyId: {
        type: String,
        required: true
    },
    secretKey: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: false
    },
    createdBy: {
        type: String,
        required: true,
    },
    updateBy: {
        type: String,
        required: false,
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updateOn: {
        type: Date,
        default: Date.now
    }
});
const Origin = (0, mongoose_1.model)('origin', originSchema);
exports.Origin = Origin;

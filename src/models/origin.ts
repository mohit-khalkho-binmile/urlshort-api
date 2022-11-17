/* 
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
import { Document, Schema, model, connect } from 'mongoose';
const originSchema = new Schema({
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
})

const Origin = model('origin', originSchema);

export { Origin }
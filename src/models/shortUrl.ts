/* 
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
import { Document, Schema, model, connect } from 'mongoose';
const clickDetails = new Schema({
  deviceType: {
    type: String,
    default: null
  },
  click: {
    type: Number,
    default: 0
  }
}, {_id: false});

const shortUrlSchema = new Schema({
  longUrl: {
    type: String,
    required: true
  },
  shortUrlId: {
    type: String,
    required: true,
    unique:true
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
    default:null
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
    default:null
  },
  userName: {
    type: String
  },
  email: {
    type: String,
  }
})

const ShortUrl = model('ShortUrl', shortUrlSchema);

export { ShortUrl }
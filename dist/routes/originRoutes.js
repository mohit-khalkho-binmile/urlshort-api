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
const originController_1 = require("../controller/originController");
const apiKey_1 = __importDefault(require("../middleware/apiKey"));
const router = express_1.default.Router();
router.use(apiKey_1.default);
/**
 * @swagger
 * components:
 *  schemas:
 *    getAllOrigins:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/originDetail'
 *    originDetail:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        applicationUrl:
 *          type: string
 *        applicationName:
 *          type: string
 *        keyId:
 *          type: string
 *        secretKey:
 *          type: string
 *        isActive:
 *          type: boolean
 *        createdBy:
 *          type: string
 *        createdOn:
 *          type: string
 *        updateOn:
 *          type: string
 *        __v:
 *          type: number
 *      example:
 *        _id: 62d9470f1a546930f014f1eb
 *        applicationUrl: https://localhost:8090
 *        applicationName: Adani Digitial
 *        keyId: a41a1cd6-4fed-4e53-8884-1c23330d3015
 *        secretKey: 6dfceaf99daa68213b4ec6cab72048ac
 *        isActive: true
 *        createdBy: test
 *        createdOn: 2022-07-21T12:31:11.245Z,
 *        updateOn: 2022-08-11T07:48:31.716Z
 *        __v: 0
 *    editOrigin:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        updateBy:
 *          type: string
 *      example:
 *        _id: 62fb8e49e37c1906491acd4c
 *        updateBy: Adani
 *    editResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        keyId:
 *          type: string
 *        secretKey:
 *          type: string
 *      example:
 *        message: Record Updated Succesfully
 *        keyId: 5af27020-f665-4784-b769-16fde4c1ece6
 *        secretKey: f5e03c1a39bcf51af326eb116fe1defd
 *    createorigin:
 *      type: object
 *      properties:
 *        applicationUrl:
 *          type: string
 *        applicationName:
 *          type: string
 *        createdBy:
 *          type: string
 *        isActive:
 *          type: boolean
 *      example:
 *        applicationUrl: http://localhost:8090
 *        applicationName: Adani digital
 *        createdBy: test@gmail.com
 *    deleteorigin:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *      example:
 *        id: 6316b22cad5a442cb7915d98
 *    createOriginDetail:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        status:
 *          type: boolean
 *        data:
 *          $ref: '#/components/schemas/originDetail'
 *      example:
 *        message: Record Updated Succesfully
 *        status: true
 *        data: {_id: 62d9470f1a546930f014f1eb,applicationUrl: https://localhost:8090,applicationName: Adani Digitial,keyId: a41a1cd6-4fed-4e53-8884-1c23330d3015,secretKey: 6dfceaf99daa68213b4ec6cab72048ac,isActive: true,createdBy: test,updateOn: 2022-08-11T07:48:31.716Z,createdOn: 2022-07-21T12:31:11.245Z,__v: 0}
 *  parameter:
 *    id:
 *      in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: Insert Id
 */
/**
 * @swagger
 * /create/origin:
 *  post:
 *    summary: Create a Origin
 *    tags: [Create Origin]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/createorigin'
 *    responses:
 *      200:
 *        description: Creare origin
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/createOriginDetail'
 *      500:
 *        description: Some server error
 *
 */
router.post('/create/origin', originController_1.createOrigin);
/**
 * @swagger
 * /edit/origin:
 *  put:
 *    summary: Update a Origin
 *    tags: [Create Origin]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/editOrigin'
 *    responses:
 *      200:
 *        description: Return keyId and secretKey
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/editResponse'
 *      500:
 *        description: Some server error
 *
 */
router.put('/edit/origin', originController_1.editOrigin);
// /**
//  * @swagger
//  * /delete-origin/{id}:
//  *  delete:
//  *    summary: Returns delete records
//  *    tags: [Create Origin]
//  *    parameters:
//  *      - $ref: '#/components/parameter/id'
//  *    responses:
//  *      200:
//  *        description: Record deleted Succesfully
//  */
router.delete('/delete-origin/:id', originController_1.deleteOrigin);
/**
 * @swagger
 * /delete-origin:
 *  post:
 *    summary: Returns delete records
 *    tags: [Create Origin]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/deleteorigin'
 *    responses:
 *      200:
 *        description: Record deleted Succesfully
 */
router.post('/delete-origin', originController_1.deleteorigin);
/**
 * @swagger
 * /get/origins:
 *  get:
 *    summary: Returns a list of Origins
 *    tags: [Create Origin]
 *    responses:
 *      200:
 *        description: the list of Origins
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/getAllOrigins'
 */
router.get('/get/origins', originController_1.getOrigins);
exports.default = router;

/* 
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
import express from "express";
import {
    getAllShortUrls,
    getShortURlById,
    CreateShortUrl,
    resolveLongURlByShortId,
    addSmartUrl,
    getIsAvailableShortId,
    editShortUrl,
    searchShortUrl,
    getUTMtypes,
    deleteShortUrl
} from "../controller/shortUrlController";
import apiKeyAuth from "../middleware/apiKey";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    getAllShortUrls:
 *      type: object
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/shortUrlDetail'
 *        totalCount:
 *          type: number
 *    utmDetails:
 *      type: object
 *      properties:
 *        source:
 *          type: array
 *          items:
 *            type: string
 *        medium:
 *          type: array
 *          items:
 *            type: string
 *      example:
 *        source: [gmail,facebook]
 *        medium: [quora,medium]
 *    deleteDetails:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *      example:
 *        acknowledged:true
 *        deletedCount:0
 *    shortUrlDetail:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        longUrl:
 *          type: string
 *        shortUrlId:
 *          type: string
 *        shortUrl:
 *          type: string
 *        clickCount:
 *          type: number
 *        clickDetails:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/clickDetails'
 *        urlName:
 *          type: string
 *        medium:
 *          type: string
 *        source:
 *          type: string
 *        isSmartUrl:
 *          type: boolean
 *        smartUrlDetails:
 *          type: string
 *        createdOn:
 *          type: string
 *        userName:
 *          type: string
 *        email:
 *          type: string
 *        __v:
 *          type: number
 *      example:
 *        _id: 62d9470f1a546930f014f1eb
 *        longUrl: https://stackoverflow.com/questions/tagged/mongodb
 *        shortUrlId: hWu2tYobb2
 *        shortUrl: http://localhost:8000/hWu2tYobb2
 *        clickCount: 0
 *        clickDetails: [{deviceType: unknown,click: 10},{deviceType: Linux,click: 5}]
 *        urlName: Adani
 *        medium: email
 *        source: facebook
 *        isSmartUrl: false
 *        smartUrlDetails: null
 *        userName: test
 *        createdBy: test
 *        updatedBy: test
 *        email: swagertest@gmail.com
 *        updateOn: 2022-08-11T07:48:31.716Z
 *        createdOn: 2022-07-21T12:31:11.245Z
 *        __v: 0
 *    clickDetails:
 *      type: object
 *      properties:
 *        deviceType:
 *          type: string
 *        click:
 *          type: number
 *    addShortUrl:
 *      type: object
 *      properties:
 *        shortUrlId:
 *          type: string
 *          description: the smartUrl 
 *        smartUrl:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/deviceUrl'
 *      example:
 *        shortUrlId: bsyWMocBK
 *        smartUrl: [{device: ios, device_url: http://wwww.xyz.com}]
 *    deviceUrl:
 *      type: object
 *      properties:
 *        device:
 *          type: string
 *        device_url:
 *          type: string
 *    editShortUrl:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: the smartUrl Id
 *        longUrl:
 *          type: string
 *        shortUrlId:
 *          type: string
 *        urlName:
 *          type: string
 *        isSmartUrl:
 *          type: boolean
 *        smartUrl:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/deviceUrl'
 *    searchFilter:
 *      type: object
 *      properties:
 *        fromDate:
 *          type: number
 *          description: date DD/MM/YYYY
 *        toDate:
 *          type: number
 *          description: date DD/MM/YYYY
 *        source:
 *          type: string
 *        medium:
 *          type: string
 *        isSmartUrl:
 *          type: boolean
 *        search:
 *          type: string
 *      example:
 *        fromDate: 08/10/2022
 *        toDate: 08/11/2022
 *        source: test
 *        medium: test
 *        isSmartUrl: false
 *        search: test
 *        limit: 10
 *        offset: 0
 *    createshortUrl:
 *        type: object
 *        properties:
 *          longUrl:
 *            type: string
 *          urlName:
 *            type: string
 *          medium:
 *            type: string
 *          source:
 *            type: string
 *          userName:
 *            type: string
 *          email:
 *            type: string
 *        example:
 *          longUrl: test.com
 *          urlName: This is a test URL
 *          medium: email
 *          source: linkedIn
 *          userName: testusername
 *          email: test@gmail.com
 *  parameters:
 *    shortid:
 *      in: path
 *      name: shortid
 *      required: true
 *      schema:
 *        type: string
 *      description: ID of the shortId Transfer to retrieve.
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
 * /getShorturls:
 *  get:
 *    summary: Returns a list of short URLs
 *    tags: [URL Shortening]
 *    responses:
 *      200:
 *        description: the list of short URLs
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/getAllShortUrls'
 */
/**
 * @swagger
 * components:
 *  schemas:
 *    getIsAvailableShortId:
 *      type: Object
 *      items:
 *        $ref: '#/components/schemas/availableShortId'
 *    availableShortId:
 *      type: boolean
 *      properties:
 *          isAvailable: boolean      
 *      example:
 *          isAvailable: true
 *
 */
/**
 * @swagger
 * /checkavailability/{shortid}:
 *  get:
 *    summary: Returns is available or not shortUrlId
 *    tags: [URL Shortening]
 *    parameters:
 *      - $ref: '#/components/parameters/shortid'
 *    responses:
 *      200:
 *        description: Availability of ShortUrlId
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/availableShortId'
 */
 router.get("/checkavailability/:shortid", apiKeyAuth, getIsAvailableShortId);

/**
 * @swagger
 * /create/shorturl:
 *  post:
 *    summary: create a Short Url
 *    tags: [URL Shortening]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/createshortUrl'
 *    responses:
 *      200:
 *        description: Creare Short URL
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/shortUrlDetail'
 *      500:
 *        description: Some server error
 *
 */
 router.post('/create/shorturl',apiKeyAuth, CreateShortUrl);

router.get("/getShorturls", apiKeyAuth, getAllShortUrls);
router.get('/:shortid',resolveLongURlByShortId);
/**
 * @swagger
 * /shortUrl/{shortid}:
 *  get:
 *    summary: get shortUrl details by ID
 *    tags: [URL Shortening]
 *    parameters:
 *      - $ref: '#/components/parameters/shortid'
 *    responses:
 *      200:
 *        description: get shortUrl details by ID
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/shortUrlDetail'
 */
router.get('/shortUrl/:shortid',apiKeyAuth, getShortURlById);
/**
 * @swagger
 * /add/smartUrl:
 *  post:
 *    summary: add a smart Url
 *    tags: [URL Shortening]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/addShortUrl'
 *    responses:
 *      200:
 *        description: the smartUrl was successfully created
 *        content:
 *          application/json:
 *            description: Success
 *      500:
 *        description: Some server error
 *
 */
router.post('/add/smartUrl',apiKeyAuth, addSmartUrl);
/**
 * @swagger
 * /edit/shortUrlDetails:
 *  post:
 *    summary: Edit a smart Url
 *    tags: [URL Shortening]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/editShortUrl'
 *          examples:
 *            example1:
 *              summary: updating  without smart urls
 *              value: 
 *                _id: 62d92d68324c6644a4054528
 *                longUrl: https://xyz.com/questions/tagged/mongodb
 *                shortUrlId: bsyWMocBK
 *                urlName: search-list
 *                isSmartUrl: false
 *            example2:
 *              summary: updating smart urls
 *              value: 
 *                _id: 62d92d68324c6644a4054528
 *                longUrl: https://xyz.com/questions/tagged/mongodb
 *                shortUrlId: bsyWMocBK
 *                urlName: search-list
 *                isSmartUrl: true
 *                smartUrl: [{device: ios, device_url: http://wwww.xyz.com}]
 *    responses:
 *      200:
 *        description: the smartUrl was successfully edited
 *        content:
 *          application/json:
 *            description: Success
 *      500:
 *        description: Some server error
 *
 */
router.post('/edit/shortUrlDetails',apiKeyAuth, editShortUrl);
/**
 * @swagger
 * /search/shorturl:
 *  post:
 *    summary: search filter
 *    tags: [URL Shortening]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/searchFilter'
 *    responses:
 *      200:
 *        description: the filter results
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/getAllShortUrls'
 *      500:
 *        description: Internal server error
 *
 */
router.post('/search/shorturl',apiKeyAuth, searchShortUrl);
/**
 * @swagger
 * /search/getutms:
 *  get:
 *    summary: get all source and medium distinc values
 *    tags: [URL Shortening]
 *    responses:
 *      200:
 *        description: get all source and medium distinc values
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/utmDetails'
 *      500:
 *        description: Internal server error
 */
router.get('/search/getutms',apiKeyAuth, getUTMtypes);
/**
 * @swagger
 * /delete/{id}:
 *  delete:
 *    summary: Returns delete records
 *    tags: [URL Shortening]
 *    parameters:
 *      - $ref: '#/components/parameter/id'
 *    responses:
 *      200:
 *        description: Available of Id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/deleteDetails'
 */

router.delete('/delete/:id',apiKeyAuth, deleteShortUrl);

export default router;
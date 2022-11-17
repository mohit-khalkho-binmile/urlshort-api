/* 
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
import express from "express";
import shortUrlRoute from "./shortUrlRoutes";
import origin from "./originRoutes";
const router = express.Router();


router.use([
    shortUrlRoute,
    origin,
  ]);
  
  export default router;
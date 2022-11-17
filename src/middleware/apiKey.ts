/* 
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
import { Request, Response, NextFunction } from "express";
import { Origin } from "../models/origin";

const apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
    let keyObj:any = req.headers['x-adani-key'];
    if (!req.headers['x-adani-key']) {
        return res.status(400).send({
            message : "Please provide x-adani-key header"
        });
    } else {
      const allowData = await Origin.find({ $and: [ {keyId:keyObj.split(':')[0]},{secretKey:keyObj.split(':')[1]},{applicationUrl:req.headers.origin}]});
      if(allowData.length > 0) next()
      else {
        return res.status(400).send({
          message : "Invalid key header and origin details"
      });
      }
    }
  };
  
  export default apiKeyAuth;
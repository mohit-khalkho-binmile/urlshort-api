/* 
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
import { Response, Request } from "express";
import httpStatus from "http-status";
import { Origin } from "../models/origin";
import dotenv from "dotenv";
import { checkProperties, createKeyidSecretkey } from "../utils/customFunction"

dotenv.config();
type ProcessEnv = any;
const {
  SHORT_BASE_URL,
}: ProcessEnv = process.env;


export async function createOrigin(req: Request, res: Response) {
  try {
    const data: any = req.body;
    let fieldData: any = {};
    const key: any = await createKeyidSecretkey();
    fieldData.applicationUrl = data.applicationUrl;
    fieldData.applicationName = data.applicationName;
    fieldData.createdBy = data.createdBy;
    let IsValidated: any = await checkProperties(fieldData);
    if (IsValidated && IsValidated.status === true) {
      fieldData.keyId = key.keyid;
      fieldData.secretKey = key.secretkey;
      fieldData.isActive = true ;

      const responseData: any = await Origin.findOne({ "$or": [
        { applicationName: fieldData.applicationName, isActive: fieldData.isActive, },
        { applicationUrl: fieldData.applicationUrl, isActive: fieldData.isActive, },
      ] });

      if(responseData){
        let errMessage = '';

        if(( responseData.applicationName === fieldData.applicationName ) && (responseData.applicationUrl === fieldData.applicationUrl))  {
          errMessage = 'Application name and Application url';
        } else if(responseData.applicationUrl === fieldData.applicationUrl) {
          errMessage = 'Application url';
        } else if(responseData.applicationName === fieldData.applicationName) {
          errMessage = 'Application name';
        }

        if(responseData.applicationName || responseData.applicationUrl){
          return res.status(httpStatus.OK).send({
            message: `${errMessage} already exist in database.`,
            status: false,
            data: {}
          });
        }
      }

      const response = await Origin.create(fieldData);
      const responseObj = {
        message:'Application URL successfully created.',
        status: true,
        data: response,
      };
      if(response) {
        return res.status(httpStatus.OK).send(responseObj);
      }
    } else {
      return res.status(httpStatus.BAD_REQUEST).send(IsValidated.message);
    }
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function editOrigin(req: Request, res: Response) {
  try{
    const data: any = req.body;
    let id = data._id;
    let fieldData: any = {};
    fieldData._id = id;
    fieldData.updateBy = data.updateBy;  
    let IsValidated: any = await checkProperties(fieldData);
    if (IsValidated && IsValidated.status === true) {
      fieldData.isActive=true;
      const key: any = await createKeyidSecretkey();
    
      fieldData.secretKey = key.secretkey;

      const originUpdate = await Origin.updateOne({ _id: id }, {keyId:key.keyid, secretKey:key.secretkey, updateBy:fieldData.updateBy, updateOn: new Date(), isActive:fieldData.isActive});
      if (originUpdate.acknowledged == true && originUpdate.modifiedCount == 1) {
        const responseObj :any= {};
        responseObj.message= "Record Updated Succesfully";
        responseObj.keyId = key.keyid;
        responseObj.secretKey = key.secretkey;

        return res.status(httpStatus.OK).send(responseObj);
      } else {
        return res.status(httpStatus.OK).send("Nothing To Update");
      }
   }else{
    return res.status(httpStatus.BAD_REQUEST).send(IsValidated.message);
   }
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function deleteOrigin(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const deleteResponse = await Origin.deleteOne({  _id: id });
     return res.status(httpStatus.OK).send("Record deleted Succesfully");
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function deleteorigin(req: Request, res: Response) {
  try {
    const { id } = req.body;
    if(!id) return res.status(httpStatus.OK).send("Required record id");
    const deleteResponse = await Origin.deleteOne({  _id: id });
    return res.status(httpStatus.OK).send(deleteResponse.deletedCount ? 'Record deleted Succesfully':'Record Not Found');
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function getOrigins(req: Request, res: Response) {
  try {
    const { offset=0, limit=10 }:any = req.query;
    const totalCount = await Origin.find().count()
    const allOrigins = await Origin.find().skip(offset).limit(limit);
    return res.status(httpStatus.OK).send({
      data:allOrigins,
      totalCount:totalCount
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}
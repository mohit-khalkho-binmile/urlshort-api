/* 
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
import { Response, Request } from "express";
import httpStatus from "http-status";
import { ShortUrl } from "../models/shortUrl";
import * as shortId from 'shortid';
import dotenv from "dotenv";
import { addUtmSource, checkProperties } from "../utils/customFunction"
dotenv.config();
type ProcessEnv = any;
const {
  SHORT_BASE_URL,
}: ProcessEnv = process.env;

export async function getAllShortUrls(req: Request, res: Response) {
  try {
    const { offset=0, limit=20 }:any = req.query;
    const totalCount = await ShortUrl.find().count()
    const shortUrls = await ShortUrl.find().sort({updateOn: -1}).skip(offset).limit(limit)
    return res.status(httpStatus.OK).send({
      data:shortUrls,
      totalCount:totalCount
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function getShortURlById(req: Request, res: Response) {
  try {
    const shortUrlId: string = req.params.shortid;
    const shortUrl = await ShortUrl.findOne({ shortUrlId: shortUrlId })
    if (!shortUrl) return res.sendStatus(404)
    return res.status(httpStatus.OK).send(shortUrl);
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function resolveLongURlByShortId(req: Request, res: Response) {
  try {
    const shortUrlId: string = req.params.shortid;

    const shortUrl:any = await ShortUrl.findOne({ shortUrlId: shortUrlId })
    if (!shortUrl) return res.sendStatus(404)
   
    let longUrl = addUtmSource(shortUrl);
   
    let userAgent = req.useragent ? req.useragent.platform :'unknown';
    //userAgent = 'Linux';
    if(userAgent){
    if(shortUrl.isSmartUrl){
        let devices:any = JSON.parse(shortUrl?.smartUrlDetails);
  
        let result:any = devices.filter( (item:any) => userAgent.includes(item.device));
 
        if(result.length > 0) {
          longUrl = result[0]?.device_url;
        }  
  
      }      
      if(userAgent){
        //userAgent = (userAgent == 'unknown') ? 'others' : userAgent;
        let checkDeviceExists:any =   shortUrl.clickDetails.filter( (item:any) => userAgent.includes(item.deviceType));
        
        if(checkDeviceExists.length == 0){
          const obj = {
            deviceType:userAgent,
            click:1
          }
          shortUrl.clickDetails.push(obj);
        }else{
            await  ShortUrl.updateOne(
          { _id: shortUrl._id, "clickDetails.deviceType": userAgent},
          { $inc: {  "clickDetails.$.click": 1 }}
          );
        }
      }
    }  
       
    shortUrl.clickCount++
    shortUrl.save();
    res.redirect(longUrl);
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function CreateShortUrl(req: Request, res: Response) {

  try {
    const data: any = req.body;
    let fieldData: any = {};
    fieldData.longUrl = data.longUrl;
    fieldData.urlName = data.urlName;
    fieldData.userName = data.userName;
    fieldData.email = data.email;

    let IsValidated: any = await checkProperties(fieldData);
    if (IsValidated && IsValidated.status === true) {
      let shortUrlId = shortId.generate();
      let shortUrl = `${SHORT_BASE_URL}/${shortUrlId}`;
      fieldData.shortUrlId = shortUrlId;
      fieldData.shortUrl = shortUrl;
      fieldData.medium = data?.medium;
      fieldData.source = data?.source;
      fieldData.createdBy = fieldData.userName;
      fieldData.updatedBy = fieldData.userName;
      const response = await ShortUrl.create(fieldData);
      return res.status(httpStatus.OK).send(response);
    } else {
      return res.status(httpStatus.BAD_REQUEST).send(IsValidated.message);
    }
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function addSmartUrl(req: Request, res: Response) {
  try {
    const shortUrlId: string = req.body.shortUrlId;
    const data: any = req.body;
    let fieldData: any = {};
    fieldData.shortUrlId = data.shortUrlId;
    fieldData.smartUrl = data.smartUrl;
    let IsValidated: any = await checkProperties(fieldData);

    if (IsValidated && IsValidated.status === true) {
      if(Array.isArray(data.smartUrl) !=true){
        return res.status(httpStatus.BAD_REQUEST).send("Smart Url should be an Array");
      }else{
        if(data.smartUrl.length ==0  ){
          return res.status(httpStatus.BAD_REQUEST).send("Please fill Smart Url Details.");
        }
        if(data.smartUrl.length > 0 && Object.keys(data.smartUrl[0]).length ==0){
          return res.status(httpStatus.BAD_REQUEST).send("Please fill Smart Url Details.");
        }
        const smartUrls = data.smartUrl;
        let smartUrlDetails = JSON.stringify(smartUrls);
       
        const shortUrl = await ShortUrl.findOne({ shortUrlId: shortUrlId});
        if (!shortUrl) return res.sendStatus(httpStatus.NOT_FOUND)
        shortUrl.isSmartUrl=true;
        shortUrl.smartUrlDetails = smartUrlDetails;
        shortUrl.updateOn = new Date();
        shortUrl.updatedBy = data.updatedBy;
        shortUrl.save();
        return res.status(httpStatus.OK).send('Success');
     }
    } else {
      return res.status(httpStatus.BAD_REQUEST).send(IsValidated.message);
    }

  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function getIsAvailableShortId(req: Request, res: Response) {
  try {

    const shortUrlId: string = req.params.shortid;
    const shortUrlData = await ShortUrl.findOne({ shortUrlId: shortUrlId })
    const isAvailableObj = {
      isAvailable: false,
    }
    if (!shortUrlData) {
      isAvailableObj.isAvailable = true;
    }

    return res.status(httpStatus.OK).send(isAvailableObj);
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function editShortUrl(req: Request, res: Response) {
  try {
    const data: any = req.body;
    let id = data._id;
    let requiredField: any = {};
    requiredField._id = id;
    requiredField.urlName = data.urlName;
    requiredField.longUrl = data.longUrl;
    requiredField.shortUrlId = data.shortUrlId;
    requiredField.isSmartUrl = data.isSmartUrl; 
  
    let checkData: any = await checkProperties(requiredField);
    if (checkData && checkData.status == true) {
      // if smarturl is true then it should have smarturlsdetails value
      if(data.isSmartUrl==true && Array.isArray(data.smartUrl) !=true){
        return res.status(httpStatus.BAD_REQUEST).send("Smart Url should be an Array");
      }
      if(data.isSmartUrl==true  && data.smartUrl.length ==0  ){
        return res.status(httpStatus.BAD_REQUEST).send("Please fill Smart Url Details.");
      }
      if(data.isSmartUrl==true  && data.smartUrl.length > 0 && Object.keys(data.smartUrl[0]).length ==0){
        return res.status(httpStatus.BAD_REQUEST).send("Please fill Smart Url Details.");
      }
            
      let smartUrlDetails = (data.isSmartUrl==true) ? JSON.stringify(data.smartUrl) : null;
      let shortUrl = `${SHORT_BASE_URL}/${data.shortUrlId}`;
     
      const shortUrlUpdate = await ShortUrl.updateOne({ _id: id }, {urlName:data.urlName, longUrl: data.longUrl,
         shortUrlId: data.shortUrlId, shortUrl: shortUrl, isSmartUrl:data.isSmartUrl,smartUrlDetails:smartUrlDetails,updateOn: Date.now(),updatedBy:data.updatedBy});
      if (shortUrlUpdate.acknowledged == true && shortUrlUpdate.modifiedCount == 1) {
        return res.status(httpStatus.OK).send("Record Updated Succesfully");
      } else {
        return res.status(httpStatus.OK).send("Nothing To Update");
      }
    } else {
      return res.status(httpStatus.BAD_REQUEST).send(checkData.message);
    }
  } catch (error) {
    console.error("error==", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function searchShortUrl(req: Request, res: Response) {
  try {
    let { fromDate, toDate, source, medium, isSmartUrl, search, offset=0, limit=10 } = req.body;
    let query: any = {};
    if (fromDate || toDate) {
      if (fromDate && toDate) {
        toDate = new Date(toDate);
        toDate = toDate.toISOString();
        fromDate = new Date(fromDate);
        fromDate = fromDate.toISOString();
        if (fromDate != toDate) {
          toDate = new Date(toDate);
          toDate.setHours(23, 59, 59, 999);
          toDate = toDate.toISOString();
          query['createdOn'] = {
            '$gte': new Date(fromDate),
            '$lte': new Date(toDate)
          };
        } else {
          fromDate = new Date(fromDate);
          fromDate.setSeconds(0);
          fromDate.setHours(0);
          fromDate.setMinutes(0);
          fromDate = fromDate.toISOString();
          toDate = new Date(toDate);
          toDate.setHours(23);
          toDate.setMinutes(59);
          toDate.setSeconds(59);
          toDate = toDate.toISOString();
          query['createdOn'] = {
            '$gte': new Date(fromDate),
            '$lte': new Date(toDate)
          };
        }
      } else if (toDate) {
        toDate = new Date(toDate);
        toDate = toDate.toISOString();
        query['createdOn'] = {
          '$lte': new Date(toDate)
        };
      } else {
        query['createdOn'] = {
          '$gte': new Date(fromDate)
        };
      }
    }
    if (source || medium || isSmartUrl || search) {
      query['$and'] = [];
      if (source) {
        query['$and'].push({
          source: new RegExp(source, "i")
        });
      }
      if (medium) {
        query['$and'].push({
          medium: new RegExp(medium, "i")
        });
      }
      if (isSmartUrl) {
        query['$and'].push({
          isSmartUrl: true
        });
      }
      if (search) {
        let regex = new RegExp(search,'i');
        query['$and'].push({
          '$or': [{shortUrl: regex },{urlName: regex}]
        });
      }
    }
    const data = await ShortUrl.find(query).sort({updateOn: -1}).skip(offset).limit(limit);
    const totalCount = await ShortUrl.find(query).count()
    return res.status(httpStatus.OK).send({
      data: data,
      totalCount: totalCount
    });

  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
}

export async function getUTMtypes(req: Request, res: Response) {

  try {
    let pipeline = [
      {
        "$group": {
          "_id": {
            source: "$source",
            medium: "$medium"
          }
        }
      },
      {
        "$project": {
          _id: 0, source: '$_id.source', medium: '$_id.medium'
        }
      }
    ];
    const data = await ShortUrl.aggregate(pipeline);
    let result: any = {};
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      for (let key in item) {
        if (!(key in result))
          result[key] = [];
        result[key].push(item[key]);
      }
    }
    return res.status(httpStatus.OK).send(result);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
}

export async function deleteShortUrl(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const deleteResponse = await ShortUrl.deleteOne({  _id: id });
     return res.status(httpStatus.OK).send(deleteResponse);
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}
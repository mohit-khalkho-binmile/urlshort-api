/* 
 *
 * Copyright (c) 2022 Adani Digital Labs
 * All rights reserved.
 * Adani Digital Labs Confidential Information
 *
 */
import moment from 'moment';
import {Md5} from 'ts-md5';
import { v4 as uuidv4 } from 'uuid';

const LOANG_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
/**
 *
 *@param {Check key Value Pair Exist or not} obj
 */

 export async function checkProperties(obj:any){
    let validObj:any={};
    return new Promise(function (resolve, reject) {
      for (var key in obj) {
        // console.log(key);
        if (
          obj[key] !== null &&
          obj[key] !== "" &&
          typeof obj[key] !== "undefined"
        ) {
        } else {
          validObj.status = false;
          validObj.message = key + " value Required";
          return resolve(validObj);
        }
        //if (obj[key] !== null && obj[key] != "")
      }
      validObj.status = true;
      validObj.message= "Success";
      resolve(validObj);
    });
}

/**
 * 
 * @param shortUrlData 
 * @returns utm url
 */  
export function addUtmSource(shortUrl:any) {
  let url = shortUrl.longUrl
  if (url.includes("?") ) {
    if (url.includes("utm_source") && url.includes("utm_medium")) {
      url=shortUrl.longUrl
    }

    else if (!url.includes("utm_source") && !url.includes("utm_medium")) {
    url= url + `&utm_source=${shortUrl.source}&utm_medium=${shortUrl.medium}`
    }
    else if (!url.includes("utm_medium")) {
      url= url + `&utm_medium=${shortUrl.medium}`
     }
    else if (!url.includes("utm_source")) {
     url= url + `&utm_source=${shortUrl.source}`
    }
   
    else {
     url= url + `&utm_source=${shortUrl.source}&utm_medium=${shortUrl.medium}`
    }
  }
  else {
   url= url + `?utm_source=${shortUrl.source}&utm_medium=${shortUrl.medium}`
  }
  return url;
}
/**
 * @description: to create keyId and secretKey 
 * @returns both keys
 */ 
export function createKeyidSecretkey(){
  return new Promise(function (resolve, reject) {
    const hashString = (source: string): string => Md5.hashStr(source, false);
    const rString = randomString(32,LOANG_STRING );
    const secretkey= hashString(rString+moment().unix());
    const obj : {keyid:string,secretkey:string} ={
      keyid:uuidv4(),
      secretkey:secretkey
     
    }
    resolve(obj);

  });
}

function randomString(length:number, chars:string) {
  var result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

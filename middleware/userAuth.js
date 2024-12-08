import {user} from '../models/user.js'
import argon2 from 'argon2';

async function checkUserAuthorization(req, res, next) {
  const authorization = req.header('Authorization');

  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized: Authorization header missing' });
  }

  try {
    const decodedBuffer = Buffer.from(authorization, 'base64')
    const decodedString = decodedBuffer.toString("utf8")
    const authorizationElements = decodedString.split(":")
    const primaryEmail = authorizationElements[0]
    const apiKey = authorizationElements[1]
  
    //Check if the user exists and get the API key so we can
    //validate if the hashed value matches the API key passed through
    const userRecord = await user.findOne({
      attributes: ['id', 'apiKey'], 
      where: { 
          primaryEmail: primaryEmail, 
          //apiKey: apiKey, 
          userActive: 1 
      }
    })

    //No record found for the provided email, so just return 401
    if (!userRecord) {
      return res.status(401).json({ error: 'Unauthorized: Invalid user credentials' })
    }

    //Now check if the API key passed through matches our stored hashed API key
    const isApiKeyValid = await argon2.verify(userRecord.apiKey, apiKey);
    if (isApiKeyValid) {
      req.userId = userRecord.id //make the userId available to the routes
    } else {
      return res.status(401).json({ error: 'Unauthorized: Invalid user credentials' })
    }

  } catch(error) {
    return res.status(422).json({ error: 'Authorization header bad' });
  }
  next(); 
}

export {checkUserAuthorization}
  
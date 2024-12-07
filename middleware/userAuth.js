import {user} from '../models/user.js'

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
  
    //Check if the user exists and return its id value (primary key)
    const userRecord = await user.findOne({
      attributes: ['id'], // Select only the `id` column
      where: { 
          primaryEmail: primaryEmail, 
          apiKey: apiKey, 
          userActive: 1 
      }
    })

    if (!userRecord) {
      return res.status(401).json({ error: 'Unauthorized: Invalid user credentials' })
    }
    req.userId = userRecord.id //make the userId available to the routes

  } catch(error) {
    return res.status(422).json({ error: 'Authorization header bad' });
  }
  next(); 
}

export {checkUserAuthorization}
  
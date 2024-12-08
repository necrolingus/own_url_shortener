import express from 'express'
import {checkAdminApiKey} from '../middleware/adminAuth.js'
import {validateNewUser, validateDeleteUser, validateUpdateUser} from '../controller/adminSchemaValidator.js'
import {user} from '../models/user.js'
import argon2 from 'argon2'

const adminRouter = express.Router()
adminRouter.use(checkAdminApiKey)

//Create a new user
adminRouter.post('/user', async function(req,res) {
    const requestBody = req.body
    const schemaOutcome = validateNewUser(requestBody)

    if (!schemaOutcome) {
        return res.status(422).json({'error': 'Bad schema'})
    }

    //Schema is good
    try {
        await user.create({
            ...requestBody
        })
        return res.status(200).json({'outcome': 'User created'})
    } catch (error) {
        //Handle constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(422).json({'error': error.cause.detail})
        }
        //Handle other errors
        return res.status(500).json({'error': 'Error adding the user'})
    }
})

//Delete a user
adminRouter.delete('/user', async function(req,res) {
    const requestBody = req.body
    const schemaOutcome = validateDeleteUser(requestBody)

    if (!schemaOutcome) {
        return res.status(422).json({'error': 'Bad schema'})
    }

    //Schema is good
    try {
        //Check if user exists
        const resultCountActive = await user.count(
            { where: {primaryEmail: requestBody.primaryEmail, userActive: 1 } 
        })

        const resultCountInactive = await user.count(
            { where: {primaryEmail: requestBody.primaryEmail, userActive: 0 } 
        })

        if (resultCountActive === 0 && resultCountInactive === 0) {
            return res.status(204).json({'error':'The user does not exist'})
        }

        //User exists, set as inactive
        if (resultCountActive === 1) {
            await user.update(
                { userActive: 0, userInactiveDate: new Date() },
                { where: {primaryEmail: requestBody.primaryEmail, userActive: 1 } 
            })
            return res.status(200).json({'outcome': 'User deleted. userActive is now 0'})
        } 

        //Check if user exist, but is not already inactive
        if (resultCountInactive === 1) {
            return res.status(409).json({'outcome': 'User is already inactive'})
        }

    } catch (error) {
        return res.status(500).json({'error': 'Error deleting the user'})
    } 
})

//update a user
adminRouter.patch('/user', async function(req,res) {
    let outcomeText = ""
    const requestBody = req.body
    const schemaOutcome = validateUpdateUser(requestBody)

    if (!schemaOutcome) {
        return res.status(422).json({'error': 'Bad schema'})
    }

    //Check if the admin sent any data to be updated
    if (requestBody.apiKey === undefined && requestBody.maxUrls === undefined) {
        return res.status(422).json({'error': 'Nothing requested for update'})
    } 

    //Schema is good and the admin sent data to be updated
    try {
        //Check if the user exists in either an active or inactive state
        const resultCountActive = await user.count(
            { where: {primaryEmail: requestBody.primaryEmail, userActive: 1 } 
        })

        const resultCountInActive = await user.count(
            { where: {primaryEmail: requestBody.primaryEmail, userActive: 0 } 
        })

        if (resultCountActive === 0 && resultCountInActive === 0) {
            return res.status(204).json({'error':'The user does not exist'})
        }

        //The user exists and is active
        if (resultCountActive === 1) {
            if (requestBody.apiKey !== undefined) {
                const apiKeyHash = await argon2.hash(requestBody.apiKey)

                await user.update(
                    { apiKey: apiKeyHash },
                    { where: {primaryEmail: requestBody.primaryEmail } 
                })
                outcomeText += "apiKey updated. "
            }

            if (requestBody.maxUrls !== undefined) {
                await user.update(
                    { maxUrls: requestBody.maxUrls },
                    { where: {primaryEmail: requestBody.primaryEmail } 
                })
                outcomeText += "maxUrls updated. "
            }
        } 
        
        //The user exists but is inactive. Set userActive to 1
        if (resultCountInActive === 1) {
            if (requestBody.userActive === 1) {
                await user.update(
                    { userActive: requestBody.userActive, userInactiveDate: null },
                    { where: {primaryEmail: requestBody.primaryEmail } 
                })
                outcomeText += "User reactivated. "
            } else {
                return res.status(422).json({'error': 'User inactive. Send userActive 1 to reactivate'})
            }
        }
    } catch (error) {
        return res.status(500).json({'error': 'Error updating the user'})
    }

    return res.status(200).json({'outcome': outcomeText})
})

adminRouter.get('/paths', async function(req,res) {
    return res.status(200).json({'outcome': 'all paths here'})
})

adminRouter.get('/audits', async function(req,res) {
    return res.status(200).json({'outcome': 'all audits here'})
})

export {adminRouter}
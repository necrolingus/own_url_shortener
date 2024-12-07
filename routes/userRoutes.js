import express from 'express'
import {checkUserAuthorization} from '../middleware/userAuth.js'
import {validateNewPath, validateDeletePath, validateUpdatePath} from '../controller/pathSchemaValidator.js'
import {path} from '../models/path.js'

const userRouter = express.Router()
userRouter.use(checkUserAuthorization)

//Create a new user
userRouter.post('/path', async function(req,res) {
    const requestBody = req.body
    const userId = req.userId
    
    const schemaOutcome = validateNewPath(requestBody)
    if (!schemaOutcome) {
        return res.status(422).json({'error': 'Bad schema'})
    }

    //add the userId which is the foreign key
    requestBody["userId"] = userId
    try {
        await path.create({
            ...requestBody
        })
        return res.status(200).json({'outcome': 'Path created'})
    } catch (error) {
        //Handle constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({'error': error.cause.detail})
        }
        
        //Handle other errors
        return res.status(500).json({'error': 'Error adding the user'})
    }
})

//Delete a path
userRouter.delete('/path', async function(req,res) {
    const requestBody = req.body
    const userId = req.userId
    const schemaOutcome = validateDeletePath(requestBody)

    if (!schemaOutcome) {
        return res.status(422).json({'error': 'Bad schema'})
    }

    //Schema is good
    try {
        //Check if path exists
        const resultCountActive = await path.count(
            { where: {userId: userId, path: requestBody.path, pathActive: 1 } 
        })

        const resultCountInactive = await path.count(
            { where: {userId: userId, path: requestBody.path, pathActive: 0 }
        })

        if (resultCountActive === 0 && resultCountInactive === 0) {
            return res.status(204).json({'error':'The path does not exist'})
        }

        //Path exists, set as inactive
        if (resultCountActive === 1) {
            await path.update(
                { pathActive: 0, pathInactiveDate: new Date() },
                { where: {userId: userId, path: requestBody.path } 
            })
            return res.status(200).json({'outcome': 'Path deleted. pathActive is now 0'})
        } 

        //Check if path exist, but is not already inactive
        if (resultCountInactive === 1) {
            return res.status(409).json({'outcome': 'Path is already inactive'})
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({'error': 'Error deleting the path'})
    } 
})









//update a path
userRouter.patch('/path', async function(req,res) {
    let outcomeText = ""
    const requestBody = req.body
    const userId = req.userId
    const schemaOutcome = validateUpdatePath(requestBody)

    if (!schemaOutcome) {
        return res.status(422).json({'error': 'Bad schema'})
    }

    //Check if the user sent any data to be updated
    const fields = ['redirect', 'destination', 'expireDays'];
    if (fields.every(field => requestBody[field] === undefined)) {
        return res.status(422).json({ error: 'Nothing requested for update' });
    }

    //Schema is good and the user sent data to be updated
    try {
        //Check if path exists
        const resultCountActive = await path.count(
            { where: {userId: userId, path: requestBody.path, pathActive: 1 } 
        })

        const resultCountInactive = await path.count(
            { where: {userId: userId, path: requestBody.path, pathActive: 0 }
        })

        if (resultCountActive === 0 && resultCountInactive === 0) {
            return res.status(204).json({'error':'The path does not exist'})
        }

        //The path exists and is active
        if (resultCountActive === 1) {
            if (requestBody.redirect !== undefined) {
                await path.update(
                    { redirect: requestBody.redirect },
                    { where: {userId: userId, path: requestBody.path }
                })
                outcomeText += "redirect updated. "
            }

            if (requestBody.destination !== undefined) {
                await path.update(
                    { destination: requestBody.destination },
                    { where: {userId: userId, path: requestBody.path }
                })
                outcomeText += "destination updated. "
            }

            if (requestBody.expireDays !== undefined) {
                await path.update(
                    { expireDays: requestBody.expireDays },
                    { where: {userId: userId, path: requestBody.path }
                })
                outcomeText += "expireDays updated. "
            }
        } 
        
        //The path exists but is inactive. Set pathActive to 1
        if (resultCountInactive === 1) {
            if (requestBody.pathActive === 1) {
                await path.update(
                    { pathActive: requestBody.pathActive, pathInactiveDate: null },
                    { where: {userId: userId, path: requestBody.path }
                })
                outcomeText += "Path reactivated. "
            } else {
                outcomeText += "Path inactive. Send pathActive 1 to reactivate. "
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({'error': 'Error updating the path'})
    }

    return res.status(200).json({'outcome': outcomeText})
})

export {userRouter}
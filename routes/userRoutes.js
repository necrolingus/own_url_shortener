import express from 'express'
import {checkUserAuthorization} from '../middleware/userAuth.js'
import {validateNewPath, validateDeletePath, validateUpdatePath} from '../controller/pathSchemaValidator.js'
import {path} from '../models/path.js'
import axios from 'axios'
import {config} from '../controller/config.js'

const userRouter = express.Router()
userRouter.use(checkUserAuthorization)

//Function to call update-paths after paths are added, deleted, or modified
async function updatePaths() {
    try {
        const response = await axios.post(`http://localhost:${config.port}/${config.pathPrepend}/update-paths`,{}, {
            headers: {
                'api-key': config.updatePathsSecretValue
            }
        })
    } catch (error) {
        console.log("Could not call update-paths")
    }
}

//Create a new user
userRouter.post('/path', async function(req,res) {
    const requestBody = req.body
    const userId = req.userId //Added by the userAuth middleware
    const maxPaths = req.maxPaths //Added by the userAuth middleware
    
    const schemaOutcome = validateNewPath(requestBody)
    if (!schemaOutcome) {
        return res.status(422).json({'error': 'Bad schema'})
    }

    //Add the userId as our foreign key
    requestBody["userId"] = userId 

    //Check if the user has more than maxPaths number of active paths
    //and return an error if they do
    const resultCountCurrentPaths = await path.count(
        { where: {userId: userId, pathActive: 1 } 
    })
    if (resultCountCurrentPaths >= maxPaths){
        return res.status(422).json({'error': 'User has too many active paths. Either update the user maxPaths value or disable old paths'})
    }

    //User has less than their maxPaths number of paths, so lets create the new path
    try {
        await path.create({
            ...requestBody
        })

        //update the paths
        await updatePaths()

        //Build the URL so end users know what URL they should share
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const userUrl = `Share this URL: ${baseUrl}/${config.pathPrepend}/${requestBody.path}`

        return res.status(200).json({'outcome': userUrl})
    } catch (error) {
        //Handle constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(422).json({'error': error.cause.detail})
        }
        
        //Handle other errors
        return res.status(500).json({'error': 'Error adding the path'})
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
            
            //update the paths
            await updatePaths()
            return res.status(200).json({'outcome': 'Path deleted. pathActive is now 0'})
        } 

        //Check if path exist, but is not already inactive
        if (resultCountInactive === 1) {
            return res.status(409).json({'outcome': 'Path is already inactive'})
        }

    } catch (error) {
        return res.status(500).json({'error': 'Error deleting the path'})
    } 
})

//update a path
userRouter.patch('/path', async function(req,res) {
    let outcomeText = ""
    const requestBody = req.body
    const userId = req.userId
    const maxPaths = req.maxPaths //Added by the userAuth middleware
    const schemaOutcome = validateUpdatePath(requestBody)

    if (!schemaOutcome) {
        return res.status(422).json({'error': 'Bad schema'})
    }

    //Check if the user will have > maxPaths active paths after re-enabling an old path
    const resultCountCurrentPaths = await path.count(
        { where: {userId: userId, pathActive: 1 } 
    })
    if (resultCountCurrentPaths + 1 >= maxPaths){
        return res.status(422).json({'error': 'User will have more than maxPaths active paths after reactivating this path. Either update the user maxPaths value or disable old paths'})
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
                return res.status(422).json({'error': 'Path inactive. Send pathActive 1 to reactivate.'})
            }
        }
    } catch (error) {
        return res.status(500).json({'error': 'Error updating the path'})
    }

    //update the paths
    await updatePaths()
    return res.status(200).json({'outcome': outcomeText})
})

//get all user paths
userRouter.get('/path', async function(req,res) {
    const userId = req.userId
    const pathMap = {}

    const paths = await path.findAll({
        attributes: ['path', 'redirect', 'destination', 'pathActive'], 
        where: {userId: userId}
    })

    paths.forEach((pathInstance) => {
        const { path: key, redirect, destination, pathActive } = pathInstance.dataValues
        pathMap[key] = { redirect, destination, pathActive }
    })

    return res.status(200).json({'outcome': pathMap})
})

export {userRouter}
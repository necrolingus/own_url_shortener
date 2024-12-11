import express from 'express'
import {getAllPaths} from '../controller/pathGetAll.js'
import {config} from '../controller/config.js'

//createDynamicPathRouter is called by index.js
//dynamicPathRouter.post is called by routes/userRoutes.js whenever a route gets modified
//so that the object "allPaths" can be updated.
const createDynamicPathRouter = (allPaths) => {
    const dynamicPathRouter = express.Router()

    dynamicPathRouter.get('/:id', async function(req,res) {
        const path = req.params.id

        if (path in allPaths) {
            const theObj = allPaths[path]
            const pathRedirect = theObj.redirect
            const pathDestination = theObj.destination
            const pathPathActive = theObj.pathActive

            if (pathPathActive === 1) {
                return res.redirect(pathRedirect, pathDestination)
            }
        }
        
        return res.status(404).send("Not Found")
    })

    dynamicPathRouter.post('/update-paths', async function(req,res) {
        const apiKey = req.header('api-key')
       
        if (apiKey === config.updatePathsSecretValue && apiKey !== undefined) {
            allPaths = await getAllPaths()
            return res.status(200).send("OK")
        }

        return res.status(401).json({ error: 'Unauthorized: Invalid API key' })
    })

    return dynamicPathRouter
}

export {createDynamicPathRouter}
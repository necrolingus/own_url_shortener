import express from 'express'

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
    return dynamicPathRouter
}

export {createDynamicPathRouter}
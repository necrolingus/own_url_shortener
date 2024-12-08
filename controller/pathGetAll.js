import {path} from '../models/path.js'

async function getAllPaths(app) {
    const pathMap = {}
    const paths = await path.findAll({
        attributes: ['path', 'redirect', 'destination', 'pathActive'], 
    })

    // Convert the result to a JSON object with `path` as the key
    paths.forEach((pathInstance) => {
        const { path: key, redirect, destination, pathActive } = pathInstance.dataValues
        pathMap[key] = { redirect, destination, pathActive }
    })
    
    return pathMap
}

export {getAllPaths}
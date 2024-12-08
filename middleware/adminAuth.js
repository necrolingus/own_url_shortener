import {config} from '../controller/config.js'

const adminSecretValue = config.adminSecretValue

function checkAdminApiKey(req, res, next) {
    const apiKey = req.header('api-key') // Retrieve the api-key from headers
    
    if (!apiKey) {
      return res.status(401).json({ error: 'Unauthorized: API key missing' })
    }
  
    if (apiKey !== adminSecretValue) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API key' })
    }
  
    next()
  }

  export {checkAdminApiKey}
  
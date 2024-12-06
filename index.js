import express from 'express'
import {router} from './routes/routes.js'
import {config} from './controller/config.js'
import {headers} from './middleware/headers.js'
import {globalLimiter} from './middleware/rateLimit.js'


const app = new express()
const port = config.port

// Middleware to parse json data
app.use(express.json());

//handle x-forwarded-for header and other security stuff
app.set('trust proxy', config.rl_number_of_proxies)
app.use(globalLimiter)
app.disable('x-powered-by')
app.use(headers)

//set api router 
app.use('/api', router)

//start express
app.listen(port, (err) => {
    console.log(`Server is listening on Port ${port}`)
    if (err) {
        console.log(err)
    }
})

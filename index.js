import express from 'express'
import {config} from './controller/config.js'
import {headers} from './middleware/headers.js'
import {globalLimiter} from './middleware/rateLimit.js'
import {ensureDatabaseExists} from './controller/createDatabaseIfNotExists.js'
import {createOrUpdateTables} from './models/modelSync.js'
import {adminRouter} from './routes/adminRoutes.js'
import {userRouter} from './routes/userRoutes.js'
import {createDynamicPathRouter} from './routes/dynamicPathRoutes.js'
import {auditMiddleware} from './middleware/audit.js'
import {getAllPaths} from './controller/pathGetAll.js'
import {startPathCleanup} from  './controller/deleteExpiredPaths.js'

const app = express()
const port = config.port

// Set the app settings
app.use(express.json())
app.set('trust proxy', config.rl_number_of_proxies)
app.disable('x-powered-by')
app.use(headers)
app.use(globalLimiter)
app.use(auditMiddleware)

//Set API router
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

//Ensure database exists
ensureDatabaseExists() 
    //Then create the tables
    .then(() => {
        return createOrUpdateTables()
    })
    //Then get all the DB paths
    .then(() => {
        return getAllPaths()
    })
    //Then start up the dynamic endpoints and pass through the DB paths
    .then((allPaths) => {
        return app.use(`/${config.pathPrepend}`, createDynamicPathRouter(allPaths))
    })
     //Then start the server
    .then(() => {
        app.listen(port, (err) => {
            if (err) {
            console.error('Error starting the server:', err)
            } else {
            const cleanup = config.dbPathCleanupHours * 60 * 60 * 1000 //hours converted to milliseconds
            startPathCleanup(cleanup)
            console.log(`Server is listening on port ${port}`)
            }
        });
    })
    .catch((error) => {
    console.error('Error during app initialization:', error)
});

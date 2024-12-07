import express from 'express'
import {config} from './controller/config.js'
import {headers} from './middleware/headers.js'
import {globalLimiter} from './middleware/rateLimit.js'
import {ensureDatabaseExists} from './controller/createDatabaseIfNotExists.js'
import {createOrUpdateTables} from './models/modelSync.js'
import { adminRouter } from './routes/adminRoutes.js'
import { userRouter } from './routes/userRoutes.js'

const app = express()
const port = config.port

// Set the app settings
app.use(express.json())
app.set('trust proxy', config.rl_number_of_proxies)
app.disable('x-powered-by')
app.use(headers)
app.use(globalLimiter)

//Set API router
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

//Ensure database exists
ensureDatabaseExists() 
    //Then create the tables
    .then(() => {
        return createOrUpdateTables(); 
    })
    .then(() => {
        //Then start the server
        app.listen(port, (err) => {
            if (err) {
            console.error('Error starting the server:', err);
            } else {
            console.log(`Server is listening on port ${port}`);
            }
        });
    })
    .catch((error) => {
    console.error('Error during app initialization:', error);
});

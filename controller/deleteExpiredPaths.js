import {path} from '../models/path.js'
import { literal } from '@sequelize/core';

async function updateExpiredPaths() {
    const [numRecordsUpdated] = await path.update(
        { pathActive: 0 }, 
        { where: literal(`"createdAt" + ("expireDays" * INTERVAL '1 day') < NOW()`) }
    )
    console.log(`${numRecordsUpdated} paths have been updated to inactive`)
}
// Function to start the cleanup process
function startPathCleanup(intervalMs) {
    // Run cleanup immediately
    updateExpiredPaths()

    // Schedule periodic cleanup
    setInterval(updateExpiredPaths, intervalMs)
}

export {startPathCleanup}
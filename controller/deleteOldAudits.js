import { audit } from '../models/audit.js'
import { literal } from '@sequelize/core';
import {config} from '../controller/config.js'

async function deleteOldAudits() {
    const numRecordsDeleted = await audit.destroy({
        where: literal(`"createdAt" < NOW() - INTERVAL '${config.dbAuditDaysToKeep} days'`)
    })
    console.log(`${numRecordsDeleted} audit records have been deleted. You keep audits for ${config.dbAuditDaysToKeep} days`)
}
// Function to start the cleanup process
function startAuditCleanup(intervalMs) {
    // Run cleanup immediately
    deleteOldAudits()

    // Schedule periodic cleanup
    setInterval(deleteOldAudits, intervalMs)
}

export {startAuditCleanup}
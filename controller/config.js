export const config = {
    port: process.env.OUS_PORT || 3000,
    adminSecretValue: process.env.OUS_ADMIN_SECRET,
    updatePathsSecretValue: process.env.OUS_UPDATE_PATHS_SECRET,
    pathPrepend: process.env.OUS_PATH_PREPEND || 's',
    dbHostname: process.env.OUS_DB_HOSTNAME,
    dbPort: process.env.OUS_DB_PORT,
    dbDatabasename: process.env.OUS_DB_DATABASENAME,
    dbUsername: process.env.OUS_DB_USERNAME,
    dbPassword: process.env.OUS_DB_PASSWORD,
    dbUserTable: process.env.OUS_DB_USER_TABLE,
    dbPathTable: process.env.OUS_DB_PATH_TABLE,
    dbPathCleanupHours: process.env.OUS_DB_PATH_CLEANUP_HOURS || 1,
    dbAuditCleanupHours: process.env.OUS_DB_AUDIT_CLEANUP_HOURS || 1,
    dbAuditDaysToKeep: process.env.OUS_DB_AUDIT_AUDIT_DAYS_TO_KEEP || 5,
    dbAuditTable: 'audit',
    disableAuditDelete: process.env.OUS_DISABLE_AUDIT_DELETE || 1,
    rl_window_minutes: process.env.OUS_RL_WINDOW_MINUTES || 3,
    rl_requests_in_window: process.env.OUS_RL_REQUESTS_IN_WINDOW || 80,
    rl_number_of_proxies: process.env.OUS_RL_NUMBER_OF_PROXIES || 2
}
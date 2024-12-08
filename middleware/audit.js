import { audit } from '../models/audit.js'

async function logAudit(req, res, responseBody) {
    const requestBody = req.body
    const fullPath = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const sanitizedHeaders = { ...req.headers }
    delete sanitizedHeaders['api-key']
    delete sanitizedHeaders['authorization']

    try {
        // Create audit entry
        await audit.create({
            data: {
                requestBody,
                responseBody,
            },
            responseCode: res.statusCode,
            allHeaders: sanitizedHeaders,
            fullPath: fullPath,
            httpMethod: req.method,
        })
    } catch (error) {
        console.error('Error saving audit log:', error)
    }
}

async function auditMiddleware(req, res, next) {
    const originalSend = res.send
    const originalRedirect = res.redirect

    // Override res.send to log audit and then call the original send
    res.send = async function (body) {
        let responseBody = '';
        if (typeof body === 'string') {
            try {
                responseBody = JSON.parse(body)
            } catch {
                responseBody = body
            }
        }
        await logAudit(req, res, responseBody)
        return originalSend.call(this, body) // Call the original send function with the response body
    }

    // Override res.redirect to log audit and then call the original redirect
    res.redirect = async function (statusCode, url) {
        // If statusCode is not passed, default to 302
        if (typeof statusCode === 'string') {
            url = statusCode
            statusCode = 302
        }

        const responseBody = { redirectedTo: url, statusCode: statusCode }
        await logAudit(req, res, responseBody)
        originalRedirect.call(this, statusCode, url) // Call the original redirect method
    }

    next()
}

export { auditMiddleware }


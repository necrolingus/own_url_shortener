import { audit } from '../models/audit.js';

async function auditMiddleware(req, res, next) {
    const requestBody = req.body
    const originalSend = res.send // Capture the original send function to intercept the response

    res.send = async function (body) {
        //Get response body into JSON format
        let responseBody = ''
        if (typeof body === 'string') {
            try {
                responseBody = JSON.parse(body); // Parse the string into JSON
            } catch {
                // If parsing fails, keep the body as-is
            }
        }

        const fullPath = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const sanitizedHeaders = { ...req.headers }
        delete sanitizedHeaders['api-key']
        delete sanitizedHeaders['authorization']

        try {
            // Create audit entry
            await audit.create({
                data: {
                    requestBody,
                    responseBody
                },
                responseCode: res.statusCode,
                allHeaders: sanitizedHeaders,
                fullPath: fullPath,
                httpMethod: req.method
            })
        } catch (error) {
            console.error('Error saving audit log:', error)
        }

        // Call the original send function with the response body
        return originalSend.call(this, body)
    }
    next()
}

export { auditMiddleware }

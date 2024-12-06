import { config } from '../controller/config.js'
import { rateLimit } from 'express-rate-limit'

const globalLimiter = rateLimit({
	windowMs: config.rl_window_minutes * 60 * 1000, //1 * 60 * 1000, // 1 minutes
	limit: config.rl_requests_in_window, // Limit each IP to 100 requests per `window`
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

export {globalLimiter}
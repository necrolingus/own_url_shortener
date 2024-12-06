export const config = {
    port: process.env.OUS_PORT || 3000,
    adminSecretValue: process.env.OUS_ADMIN_SECRET,
    rl_window_minutes: process.env.OUS_RL_WINDOW_MINUTES || 3,
    rl_requests_in_window: process.env.OUS_RL_REQUESTS_IN_WINDOW || 80,
    rl_number_of_proxies: process.env.OUS_RL_NUMBER_OF_PROXIES || 2
}
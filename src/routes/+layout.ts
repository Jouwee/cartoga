import posthog from 'posthog-js'
// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true

posthog.init('phc_C5dhvjqUeyWnOpGllNvTkBjNoxGZRcFaa5ItsyCqw2', { api_host: 'https://app.posthog.com' })

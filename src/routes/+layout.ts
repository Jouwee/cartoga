import posthog from 'posthog-js'
import { browser } from '$app/environment'
// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true

export const load = async () => {
    if (browser) {
        posthog.init('phc_C5dhvjqUeyWnOpGllNvTkBjNoxGZRcFaa5ItsyCqw2', { api_host: 'https://app.posthog.com' })
    }
    return
}

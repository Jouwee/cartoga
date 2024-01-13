import { writable } from 'svelte/store'

export const renderingContextStore = writable<RenderingContext>({
    zoomLevel: 2,
    zoomMultiplier: 1,
    pan: {
        x: 0,
        y: 0,
    },
})

export interface RenderingContext {
    zoomLevel: number
    zoomMultiplier: number
    pan: {
        x: number
        y: number
    }
}

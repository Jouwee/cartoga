import type { Point } from '$lib/map-model'
import { writable } from 'svelte/store'

export const selectionStore = writable<undefined | Point>(undefined)

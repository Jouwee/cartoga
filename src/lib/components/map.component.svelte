<script lang="ts">
    import { Assets } from '$lib/assets/asset-loader'
    import type { MapModel } from '$lib/map-model'
    import { LAYERS, MapRenderer } from '$lib/map-renderer'
    import { DirtyRect, type Tool } from '$lib/tool'
    import { createEventDispatcher, onMount } from 'svelte'
    import Loading from './loading.svelte'
    const dispatch = createEventDispatcher()

    export let model: MapModel
    const renderer = new MapRenderer()
    let contexts: CanvasRenderingContext2D[] = []
    let loading: { progress: number; message: string } | undefined = { progress: 0, message: 'Initializing' }

    onMount(async () => {
        await Assets.preload((progress, message) => (loading = { progress, message }))
        loading = undefined
        const layers = Array.from(document.querySelectorAll('canvas'))
        contexts = layers.map(canvas => canvas.getContext('2d') as CanvasRenderingContext2D)
        const eventLayer = layers[layers.length - 1]

        render()
        renderer.renderBackground(model, contexts[0], new DirtyRect(0, 0, 1200, 860))

        eventLayer.addEventListener('mousedown', evt => {
            dispatch('click', {
                x: evt.clientX - (eventLayer.offsetLeft ?? 0),
                y: evt.clientY - (eventLayer.offsetTop ?? 0),
            })
            dispatch('pressDown', {
                x: evt.clientX - (eventLayer.offsetLeft ?? 0),
                y: evt.clientY - (eventLayer.offsetTop ?? 0),
            })
        })

        eventLayer.addEventListener('mousemove', evt => {
            if (evt.buttons === 1) {
                dispatch('pressDown', {
                    x: evt.clientX - (eventLayer.offsetLeft ?? 0),
                    y: evt.clientY - (eventLayer.offsetTop ?? 0),
                })
            }
            dispatch('move', {
                x: evt.clientX - (eventLayer.offsetLeft ?? 0),
                y: evt.clientY - (eventLayer.offsetTop ?? 0),
            })
        })

        eventLayer.addEventListener('mouseup', evt => {
            dispatch('release', {
                x: evt.clientX - (eventLayer.offsetLeft ?? 0),
                y: evt.clientY - (eventLayer.offsetTop ?? 0),
            })
        })
    })

    // TODO: Baseado em eventos
    export function render(dirtyRect?: DirtyRect) {
        const repaintRect = dirtyRect ?? new DirtyRect(0, 0, 1200, 860)
        renderer.renderTerrain(model, contexts[LAYERS.terrain], repaintRect)
        renderer.renderTerrainFeatures(model, contexts[LAYERS.terrainFeatures])
        renderer.renderPoints(model, contexts[LAYERS.points])
        renderer.renderPaths(model, contexts[LAYERS.paths])
    }

    export function renderTool<O>(tool: Tool<O>, currentMousePosition: [number, number], options: O) {
        renderer.renderTool(tool, currentMousePosition, options, contexts[LAYERS.tool], model)
    }
</script>

{#if loading}
    <Loading progress={loading.progress} message={loading.message} />
{/if}

<div class="canvas-container">
    {#each Object.values(LAYERS) as layer}
        <canvas id={'layer-' + layer} width="1200" height="860" style="border:1px solid #000000;" />
    {/each}
</div>

<style>
    .canvas-container {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    canvas {
        position: absolute;
    }
</style>

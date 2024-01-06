<script lang="ts">
    import type { MapModel } from '$lib/map-model'
    import { LAYERS, MapRenderer } from '$lib/map-renderer'
    import { DirtyRect, type Tool } from '$lib/tool'
    import { createEventDispatcher, onMount } from 'svelte'
    const dispatch = createEventDispatcher()

    export let model: MapModel
    const renderer = new MapRenderer()
    let contexts: CanvasRenderingContext2D[] = []

    onMount(() => {
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
        renderer.renderTerrain(model, contexts[1], repaintRect)
        renderer.renderTerrainFeatures(model, contexts[2], repaintRect)
        renderer.renderPoints(model, contexts[3], repaintRect)
    }

    export function renderTool<O>(tool: Tool<O>, currentMousePosition: [number, number], options: O) {
        renderer.renderTool(tool, currentMousePosition, options, contexts[LAYERS.tool])
    }
</script>

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

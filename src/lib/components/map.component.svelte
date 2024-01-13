<script lang="ts">
    import { Assets } from '$lib/assets/asset-loader'
    import type { MapModel } from '$lib/map-model'
    import { renderingContextStore } from '$lib/stores/rendering.store'
    import { LAYERS, MapRenderer } from '$lib/map-renderer'
    import { DirtyRect, type Tool } from '$lib/tool'
    import { createEventDispatcher, onMount } from 'svelte'
    import { get } from 'svelte/store'
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

        let startPan: { x: number; y: number } = { x: 0, y: 0 }

        function mouseEventModelPosition(evt: MouseEvent) {
            const context = get(renderingContextStore)
            const screenX = evt.clientX - (eventLayer.offsetLeft ?? 0)
            const screenY = evt.clientY - (eventLayer.offsetTop ?? 0)
            return {
                screenX,
                screenY,
                x: (screenX - context.pan.x) / context.zoomMultiplier,
                y: (screenY - context.pan.y) / context.zoomMultiplier,
            }
        }

        eventLayer.addEventListener('mousedown', evt => {
            if (evt.buttons === 1) {
                dispatch('click', mouseEventModelPosition(evt))
                dispatch('pressDown', mouseEventModelPosition(evt))
            }
            if (evt.buttons === 4) {
                startPan = {
                    x: evt.clientX - (eventLayer.offsetLeft ?? 0),
                    y: evt.clientY - (eventLayer.offsetTop ?? 0),
                }
            }
        })

        eventLayer.addEventListener('mousemove', evt => {
            if (evt.buttons === 1) {
                dispatch('pressDown', mouseEventModelPosition(evt))
            }
            if (evt.buttons === 4) {
                renderingContextStore.update(ctx => {
                    const x = ctx.pan.x + (evt.clientX - (eventLayer.offsetLeft ?? 0) - startPan.x)
                    const y = ctx.pan.y + (evt.clientY - (eventLayer.offsetTop ?? 0) - startPan.y)
                    ctx.pan = {
                        x: Math.min(0, Math.max(-1200, x)),
                        y: Math.min(0, Math.max(-860, y)),
                    }
                    return ctx
                })
                startPan = {
                    x: evt.clientX - (eventLayer.offsetLeft ?? 0),
                    y: evt.clientY - (eventLayer.offsetTop ?? 0),
                }
            }
            dispatch('move', mouseEventModelPosition(evt))
        })

        eventLayer.addEventListener('mouseup', evt => {
            dispatch('release', mouseEventModelPosition(evt))
        })

        const zoomArray = [0.25, 0.5, 1, 1.5, 2, 3, 4]

        eventLayer.addEventListener('wheel', evt => {
            if (evt.deltaY > 0) {
                renderingContextStore.update(ctx => {
                    const originalZoom = ctx.zoomMultiplier
                    ctx.zoomLevel = Math.max(0, ctx.zoomLevel - 1)
                    ctx.zoomMultiplier = zoomArray[ctx.zoomLevel]
                    const zoomDiff = ctx.zoomMultiplier / originalZoom
                    // ctx.pan.x = ctx.pan.x * zoomDiff
                    // ctx.pan.y = ctx.pan.y * zoomDiff
                    // TODO: Zoom on center
                    return ctx
                })
            } else {
                renderingContextStore.update(ctx => {
                    const originalZoom = ctx.zoomMultiplier
                    ctx.zoomLevel = Math.min(zoomArray.length, ctx.zoomLevel + 1)
                    ctx.zoomMultiplier = zoomArray[ctx.zoomLevel]
                    const zoomDiff = ctx.zoomMultiplier / originalZoom
                    // ctx.pan.x = ctx.pan.x * zoomDiff
                    // ctx.pan.y = ctx.pan.y * zoomDiff
                    // TODO: Zoom on center
                    return ctx
                })
            }
            return false
        })
    })

    renderingContextStore.subscribe(context => {
        if (!loading) {
            render()
        }
    })

    // TODO: Baseado em eventos
    export function render(dirtyRect?: DirtyRect) {
        const context = get(renderingContextStore)
        const repaintRect = dirtyRect ?? new DirtyRect(0, 0, 1200, 860)
        renderer.renderTerrain(model, contexts[LAYERS.terrain], context, repaintRect)
        renderer.renderTerrainFeatures(model, contexts[LAYERS.terrainFeatures], context, repaintRect)
        renderer.renderPoints(model, contexts[LAYERS.points], context, repaintRect)
        renderer.renderPaths(model, contexts[LAYERS.paths], context, repaintRect)
    }

    export function renderTool<O>(tool: Tool<O>, currentMousePosition: [number, number], options: O) {
        const context = get(renderingContextStore)
        renderer.renderTool(
            tool,
            currentMousePosition,
            options,
            contexts[LAYERS.tool],
            context,
            new DirtyRect(0, 0, 1200, 860),
            model
        )
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

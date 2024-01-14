import { Assets } from './assets/asset-loader'
import type { MapModel } from './map-model'
import { PathRenderer } from './rendering/path-renderer'
import { PointsRenderer } from './rendering/points-renderer'
import { RenderingProxy } from './rendering/rendering-proxy'
import { TerrainFeatureRenderer } from './rendering/terrain-feature-renderer'
import { TerrainRenderer } from './rendering/terrain-renderer'
import type { RenderingContext } from './stores/rendering.store'
import { Telemetry } from './telemetry/telemetry'
import type { DirtyRect, Tool } from './tool'

export const LAYERS = {
    background: 0,
    terrain: 1,
    terrainFeatures: 2,
    paths: 3,
    points: 4,
    tool: 5,
}

export class MapRenderer {
    private terrainRenderer: TerrainRenderer
    private terrainFeatureRenderer: TerrainFeatureRenderer
    private pointRenderer: PointsRenderer
    private pathRenderer: PathRenderer = new PathRenderer()

    constructor() {
        this.terrainRenderer = new TerrainRenderer()
        this.terrainFeatureRenderer = new TerrainFeatureRenderer()
        this.pointRenderer = new PointsRenderer()
        // TODO
        if (typeof document == 'undefined') {
            return
        }
        setTimeout(() => this.terrainRenderer.preload(), 100)
        setTimeout(() => this.terrainFeatureRenderer.preload(), 100)
        setTimeout(() => this.pointRenderer.preload(), 100)
    }

    renderBackground(model: MapModel, rendering: CanvasRenderingContext2D, repaintRect: DirtyRect) {
        Telemetry.timerStart('Render Background')
        const pattern = rendering.createPattern(Assets.water, 'repeat')
        if (pattern) {
            rendering.fillStyle = pattern
            rendering.fillRect(repaintRect.x, repaintRect.y, repaintRect.width, repaintRect.height)
        }
        Telemetry.timerEnd('Render Background')
    }

    renderTerrain(
        model: MapModel,
        rendering: CanvasRenderingContext2D,
        context: RenderingContext,
        repaintRect: DirtyRect
    ) {
        Telemetry.timerStart('Render Terrain')
        this.terrainRenderer.render(model, new RenderingProxy(rendering, context, repaintRect))
        Telemetry.timerEnd('Render Terrain')
    }

    renderTerrainFeatures(
        model: MapModel,
        rendering: CanvasRenderingContext2D,
        context: RenderingContext,
        repaintRect: DirtyRect
    ) {
        Telemetry.timerStart('Render Terrain Features')
        this.terrainFeatureRenderer.render(model, new RenderingProxy(rendering, context, repaintRect))
        Telemetry.timerEnd('Render Terrain Features')
    }

    renderPoints(
        model: MapModel,
        rendering: CanvasRenderingContext2D,
        context: RenderingContext,
        repaintRect: DirtyRect
    ) {
        Telemetry.timerStart('Render Points')
        this.pointRenderer.render(model, new RenderingProxy(rendering, context, repaintRect))
        Telemetry.timerEnd('Render Points')
    }

    renderPaths(
        model: MapModel,
        rendering: CanvasRenderingContext2D,
        context: RenderingContext,
        repaintRect: DirtyRect
    ) {
        Telemetry.timerStart('Render Paths')
        this.pathRenderer.render(model, new RenderingProxy(rendering, context, repaintRect))
        Telemetry.timerEnd('Render Paths')
    }

    renderTool<O>(
        tool: Tool<O>,
        currentMousePosition: [number, number],
        options: O,
        rendering: CanvasRenderingContext2D,
        context: RenderingContext,
        repaintRect: DirtyRect,
        model: MapModel
    ) {
        rendering.clearRect(0, 0, 1200, 860)
        tool.render(currentMousePosition, options, new RenderingProxy(rendering, context, repaintRect), model)
    }
}

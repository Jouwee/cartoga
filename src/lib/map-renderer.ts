import { Assets } from './assets/asset-loader'
import type { MapModel } from './map-model'
import { PathRenderer } from './rendering/path-renderer'
import { PointsRenderer } from './rendering/points-renderer'
import { RenderingProxy } from './rendering/rendering-proxy'
import { TerrainFeatureRenderer } from './rendering/terrain-feature-renderer'
import { TerrainRenderer } from './rendering/terrain-renderer'
import type { RenderingContext } from './stores/rendering.store'
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
        const pattern = rendering.createPattern(Assets.water, 'repeat')
        if (pattern) {
            rendering.fillStyle = pattern
            rendering.fillRect(repaintRect.x, repaintRect.y, repaintRect.width, repaintRect.height)
        }
    }

    renderTerrain(
        model: MapModel,
        rendering: CanvasRenderingContext2D,
        context: RenderingContext,
        repaintRect: DirtyRect
    ) {
        this.terrainRenderer.render(model, new RenderingProxy(rendering, context, repaintRect))
    }

    renderTerrainFeatures(
        model: MapModel,
        rendering: CanvasRenderingContext2D,
        context: RenderingContext,
        repaintRect: DirtyRect
    ) {
        this.terrainFeatureRenderer.render(model, new RenderingProxy(rendering, context, repaintRect))
    }

    renderPoints(
        model: MapModel,
        rendering: CanvasRenderingContext2D,
        context: RenderingContext,
        repaintRect: DirtyRect
    ) {
        this.pointRenderer.render(model, new RenderingProxy(rendering, context, repaintRect))
    }

    renderPaths(
        model: MapModel,
        rendering: CanvasRenderingContext2D,
        context: RenderingContext,
        repaintRect: DirtyRect
    ) {
        this.pathRenderer.render(model, new RenderingProxy(rendering, context, repaintRect))
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

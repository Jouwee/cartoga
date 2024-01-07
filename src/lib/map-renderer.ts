import type { MapModel } from './map-model'
import { PathRenderer } from './rendering/path-renderer'
import { PointsRenderer } from './rendering/points-renderer'
import { TerrainFeatureRenderer } from './rendering/terrain-feature-renderer'
import { TerrainRenderer } from './rendering/terrain-renderer'
import type { DirtyRect, Tool } from './tool'

let background: HTMLImageElement

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
        if (!background) {
            background = new Image()
            background.src = 'http://localhost:5173/images/map/water.png'
        }
        const pattern = rendering.createPattern(background, 'repeat')
        if (pattern) {
            rendering.fillStyle = pattern
            rendering.fillRect(repaintRect.x, repaintRect.y, repaintRect.width, repaintRect.height)
        }
    }

    renderTerrain(model: MapModel, rendering: CanvasRenderingContext2D, repaintRect: DirtyRect) {
        this.terrainRenderer.render(model, rendering, repaintRect)
    }

    renderTerrainFeatures(model: MapModel, rendering: CanvasRenderingContext2D) {
        this.terrainFeatureRenderer.render(model, rendering)
    }

    renderPoints(model: MapModel, rendering: CanvasRenderingContext2D) {
        this.pointRenderer.render(model, rendering)
    }

    renderPaths(model: MapModel, rendering: CanvasRenderingContext2D) {
        this.pathRenderer.render(model, rendering)
    }

    renderTool<O>(
        tool: Tool<O>,
        currentMousePosition: [number, number],
        options: O,
        rendering: CanvasRenderingContext2D
    ) {
        rendering.clearRect(0, 0, 1200, 860)
        tool.render(currentMousePosition, options, rendering)
    }
}

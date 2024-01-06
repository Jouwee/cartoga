import { type MapModel, PointType } from './map-model'
import { TerrainRenderer } from './rendering/terrain-render'
import type { DirtyRect, Tool } from './tool'

let background: HTMLImageElement

export const LAYERS = {
    background: 0,
    terrain: 1,
    terrainFeatures: 2,
    points: 3,
    tool: 4,
}

export class MapRenderer {
    private terrainRenderer: TerrainRenderer

    constructor() {
        this.terrainRenderer = new TerrainRenderer()
        // TODO
        if (typeof document == 'undefined') {
            return
        }
        setTimeout(() => this.terrainRenderer.preload(), 100)
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
        rendering.clearRect(0, 0, 1200, 860)
        for (const polygon of model.polygons) {
            rendering.beginPath()
            rendering.fillStyle = '#00300050'
            for (const node of polygon.nodes) {
                rendering.lineTo(node[0], node[1])
            }
            rendering.fill()
        }
    }

    renderPoints(model: MapModel, rendering: CanvasRenderingContext2D) {
        rendering.clearRect(0, 0, 1200, 860)
        for (const point of model.points) {
            switch (point.type) {
                case PointType.MajorCity:
                    rendering.fillStyle = 'black'
                    rendering.beginPath()
                    rendering.arc(point.x, point.y, 5, 0, 2 * Math.PI)
                    rendering.fill()
                    rendering.fillStyle = 'white'
                    rendering.beginPath()
                    rendering.arc(point.x, point.y, 3, 0, 2 * Math.PI)
                    rendering.fill()
                    rendering.fillStyle = 'black'
                    rendering.beginPath()
                    rendering.arc(point.x, point.y, 1, 0, 2 * Math.PI)
                    rendering.fill()
                    break
                case PointType.City:
                    rendering.fillStyle = 'black'
                    rendering.beginPath()
                    rendering.arc(point.x, point.y, 5, 0, 2 * Math.PI)
                    rendering.fill()
                    break
                case PointType.Town:
                    rendering.fillStyle = 'black'
                    rendering.fillRect(point.x, point.y, 5, 5)
                    break
                case PointType.Village:
                    rendering.strokeStyle = 'black'
                    rendering.beginPath()
                    rendering.rect(point.x, point.y, 5, 5)
                    rendering.stroke()
                    break
            }
            if ('name' in point) {
                rendering.fillText(new String(point.name).toString(), point.x - 20, point.y + 15)
            }
        }
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

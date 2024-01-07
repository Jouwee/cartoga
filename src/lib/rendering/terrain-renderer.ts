import type { MapModel } from '$lib/map-model'
import type { DirtyRect } from '$lib/tool'

export class TerrainRenderer {
    private grassTexture!: HTMLImageElement
    private grassPattern!: CanvasPattern

    async preload() {
        this.grassTexture = new Image()
        this.grassTexture.src = 'http://localhost:5173/images/map/grass.png'
    }

    render(model: MapModel, rendering: CanvasRenderingContext2D, dirtyRect: DirtyRect) {
        if (this.grassTexture && !this.grassPattern) {
            const pattern = rendering.createPattern(this.grassTexture, 'repeat')
            if (pattern) {
                this.grassPattern = pattern
            }
        }
        rendering.fillStyle = this.grassPattern || '#003000FF'
        rendering.clearRect(0, 0, 1200, 860)
        rendering.beginPath()
        for (let j = 0; j < model.terrain.vector.polygons.length; j++) {
            const polygon = model.terrain.vector.polygons[j]
            rendering.moveTo(polygon.nodes[0][0], polygon.nodes[0][1])
            for (let i = 1; i < polygon.nodes.length; i++) {
                rendering.lineTo(polygon.nodes[i][0], polygon.nodes[i][1])
            }
            rendering.closePath()
        }
        // Shore effect
        rendering.strokeStyle = '#FFFFFF30'
        rendering.filter = 'blur(8px)'
        rendering.lineWidth = 32
        rendering.stroke()
        // Fill
        rendering.filter = 'none'
        rendering.fill('evenodd')
        rendering.strokeStyle = '#381d0a30'
        rendering.lineWidth = 3
        rendering.stroke()

        for (let k = 0; k < model.terrain.vector.unoptimizedUnionVectors.length; k++) {
            const vector = model.terrain.vector.unoptimizedUnionVectors[k]
            rendering.beginPath()
            for (let j = 0; j < vector.polygons.length; j++) {
                const polygon = vector.polygons[j]
                rendering.moveTo(polygon.nodes[0][0], polygon.nodes[0][1])
                for (let i = 1; i < polygon.nodes.length; i++) {
                    rendering.lineTo(polygon.nodes[i][0], polygon.nodes[i][1])
                }
            }
            rendering.fill('evenodd')
        }
    }
}

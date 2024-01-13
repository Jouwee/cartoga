import { Assets } from '$lib/assets/asset-loader'
import type { MapModel } from '$lib/map-model'
import type { RenderingProxy } from './rendering-proxy'

export class TerrainRenderer {
    private grassPattern!: CanvasPattern

    async preload() {}

    render(model: MapModel, rendering: RenderingProxy) {
        if (!this.grassPattern) {
            const pattern = rendering.createPattern(Assets.grass, 'repeat')
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

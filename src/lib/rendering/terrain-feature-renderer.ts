import { Assets } from '$lib/assets/asset-loader'
import type { MapModel } from '$lib/map-model'
import type { RenderingProxy } from './rendering-proxy'

export class TerrainFeatureRenderer {
    private offsets?: [number, number][][]
    private stampSize = [14, 16]
    private spacing = 10

    async preload() {}

    render(model: MapModel, rendering: RenderingProxy) {
        if (!this.offsets) {
            this.offsets = this.computeOffsets()
        }
        rendering.clearRect(0, 0, 1200, 860)
        rendering.filter = 'blur(4px)'
        this.drawVector(model, rendering)
        rendering.filter = 'none'
        this.drawStamps(model, rendering)
    }

    drawVector(model: MapModel, rendering: RenderingProxy) {
        for (const feature of model.features) {
            rendering.beginPath()
            for (let j = 0; j < feature.vector.polygons.length; j++) {
                const polygon = feature.vector.polygons[j]
                rendering.moveTo(polygon.nodes[0][0], polygon.nodes[0][1])
                for (let i = 1; i < polygon.nodes.length; i++) {
                    rendering.lineTo(polygon.nodes[i][0], polygon.nodes[i][1])
                }
            }
            rendering.strokeStyle = '#381d0a30'
            rendering.fillStyle = '#381d0a40'
            rendering.fill('evenodd')
            rendering.stroke()
        }
    }

    drawStamps(model: MapModel, rendering: RenderingProxy) {
        const ps = []
        for (let x = 0; x < 1200 / this.spacing; x++) {
            for (let y = 0; y < 860 / this.spacing; y++) {
                const offset = this.offsets![x][y]
                if (!offset) {
                    continue
                }
                const p: [number, number] = [
                    Math.round(x * this.spacing + offset[0]),
                    Math.round(y * this.spacing + offset[1]),
                ]
                const pixel = rendering.getPixelAt(p[0], p[1])
                if (pixel.a >= 0x20) {
                    ps.push([p[0] - this.stampSize[0] / 2, p[1] - this.stampSize[1] / 2])
                }
            }
        }
        for (const p of ps) {
            rendering.drawImage(Assets.tree, p[0], p[1])
        }
    }

    computeOffsets(): [number, number][][] {
        const offsets: [number, number][][] = []
        for (let x = 0; x < 1200 / this.spacing; x++) {
            offsets.push([])
            for (let y = 0; y < 860 / this.spacing; y++) {
                offsets[x][y] = [Math.random() * this.spacing * 0.7, Math.random() * this.spacing * 0.7]
            }
        }
        return offsets
    }
}

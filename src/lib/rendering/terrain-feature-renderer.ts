import type { MapModel } from '$lib/map-model'

export class TerrainFeatureRenderer {
    private stampTexture!: HTMLImageElement
    private offsets?: [number, number][][]
    private stampSize = [14, 16]
    private spacing = 10

    async preload() {
        this.stampTexture = new Image()
        this.stampTexture.src = '../../images/map/tree-1.png'
    }

    render(model: MapModel, rendering: CanvasRenderingContext2D) {
        if (!this.offsets) {
            this.offsets = this.computeOffsets()
        }
        rendering.clearRect(0, 0, 1200, 860)
        rendering.filter = 'blur(4px)'
        this.drawVector(model, rendering)
        rendering.filter = 'none'
        this.drawStamps(model, rendering)
    }

    drawVector(model: MapModel, rendering: CanvasRenderingContext2D) {
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

    drawStamps(model: MapModel, rendering: CanvasRenderingContext2D) {
        if (!this.stampTexture) {
            return
        }
        const imageData = rendering.getImageData(0, 0, 1200, 860)
        for (let x = 0; x < 1200 / this.spacing; x++) {
            for (let y = 0; y < 860 / this.spacing; y++) {
                const offset = this.offsets![x][y]
                const p: [number, number] = [
                    Math.round(x * this.spacing + offset[0]),
                    Math.round(y * this.spacing + offset[1]),
                ]
                if (imageData.data[p[1] * (imageData.width * 4) + p[0] * 4 + 3] >= 0x20) {
                    rendering.drawImage(this.stampTexture, p[0] - this.stampSize[0] / 2, p[1] - this.stampSize[1] / 2)
                }
            }
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

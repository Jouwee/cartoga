import type { MapModel } from '$lib/map-model'
import type { Node, Polygon } from '$lib/vector/vector'

export class PathRenderer {
    async preload() {}

    render(model: MapModel, rendering: CanvasRenderingContext2D) {
        rendering.clearRect(0, 0, 1200, 860)
        for (let j = 0; j < model.paths.length; j++) {
            this.renderPath(model.paths[j], rendering)
        }
    }

    renderPath(polygon: Polygon, rendering: CanvasRenderingContext2D) {
        rendering.beginPath()
        rendering.moveTo(polygon.nodes[0][0], polygon.nodes[0][1])
        for (let i = 1; i < polygon.nodes.length; i++) {
            const midPoint = this.midPointBtw(polygon.nodes[i - 1], polygon.nodes[i])
            rendering.quadraticCurveTo(polygon.nodes[i - 1][0], polygon.nodes[i - 1][1], midPoint[0], midPoint[1])
        }
        rendering.lineTo(polygon.nodes[polygon.nodes.length - 1][0], polygon.nodes[polygon.nodes.length - 1][1])
        rendering.filter = 'blur(0.1px)'
        rendering.strokeStyle = '#381d0aA0'
        rendering.lineWidth = 2
        rendering.lineCap = 'round'
        rendering.setLineDash([6, 4])
        rendering.stroke()
    }

    midPointBtw(p1: Node, p2: Node): Node {
        return [p1[0] + (p2[0] - p1[0]) / 2, p1[1] + (p2[1] - p1[1]) / 2]
    }
}

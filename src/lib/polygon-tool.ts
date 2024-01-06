import type { MapModel, Node, Polygon } from './map-model'
import { DirtyRect, type PressDownEvent, type Tool, type ToolOption } from './tool'

interface PolygonToolOptions {}

export class PolygonTool implements Tool<PolygonToolOptions> {
    private nodes: Node[] = []

    constructor(private type: Polygon['type'], private closed: boolean) {}

    getOptions(): ToolOption[] {
        return []
    }

    click(event: PressDownEvent, model: MapModel): DirtyRect | undefined {
        // TODO: Double-click
        if (
            this.nodes.length >= 1 &&
            this.nodes[this.nodes.length - 1][0] === event.x &&
            this.nodes[this.nodes.length - 1][1] === event.y
        ) {
            model.polygons.push({
                type: this.type,
                closed: this.closed,
                nodes: this.nodes,
            })
            const bounds = { minx: Infinity, miny: Infinity, maxx: -Infinity, maxy: -Infinity }
            for (const node of this.nodes) {
                bounds.minx = Math.min(bounds.minx, node[0])
                bounds.miny = Math.min(bounds.miny, node[0])
                bounds.maxx = Math.max(bounds.maxx, node[1])
                bounds.maxy = Math.max(bounds.maxy, node[1])
            }
            this.nodes = []
            return new DirtyRect(bounds.minx, bounds.miny, bounds.maxx - bounds.minx, bounds.maxy - bounds.miny)
        }
        this.nodes.push([event.x, event.y])
        return DirtyRect.NO_PAINT
    }

    pressDown(): DirtyRect | undefined {
        return DirtyRect.NO_PAINT
    }

    release(): DirtyRect | undefined {
        return DirtyRect.NO_PAINT
    }
}

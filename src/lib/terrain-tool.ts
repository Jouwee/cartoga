import type { MapModel } from './map-model'
import type { RenderingProxy } from './rendering/rendering-proxy'
import { DirtyRect, type PressDownEvent, type Tool, type ToolOption } from './tool'
import { VectorFactory } from './vector/vector'

export interface TerrainOptions {
    size: number
    erase: boolean
}

export class TerrainTool implements Tool<TerrainOptions> {
    getOptions(): ToolOption[] {
        return [
            {
                key: 'size',
                name: 'Size',
                type: 'number',
                default: 25,
                min: 5,
                max: 100,
                step: 1,
            },
            {
                key: 'erase',
                name: 'Erase',
                type: 'boolean',
            },
        ]
    }

    click(): DirtyRect | undefined {
        return DirtyRect.NO_PAINT
    }

    pressDown(event: PressDownEvent, model: MapModel, options: TerrainOptions): DirtyRect | undefined {
        const resolution = Math.ceil(options.size / (2 * Math.PI)) + 3
        const circle = VectorFactory.circle(event.x, event.y, options.size, resolution, Math.random() * Math.PI)
        if (options.erase) {
            model.terrain.vector = model.terrain.vector.difference(circle)
        } else {
            model.terrain.vector = model.terrain.vector.union(circle)
        }
        return undefined
    }

    release(event: PressDownEvent, model: MapModel): DirtyRect | undefined {
        model.terrain.vector = model.terrain.vector.optimize()
        return undefined
    }

    render(currentCursorPosition: [number, number], options: TerrainOptions, rendering: RenderingProxy): void {
        rendering.beginPath()
        rendering.fillStyle = '#FFFFFF50'
        rendering.arc(currentCursorPosition[0], currentCursorPosition[1], options.size, 0, Math.PI * 2)
        rendering.fill()
    }
}

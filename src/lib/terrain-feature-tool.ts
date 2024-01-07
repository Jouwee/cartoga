import type { MapModel } from './map-model'
import { DirtyRect, type PressDownEvent, type Tool, type ToolOption } from './tool'
import { Vector, VectorFactory } from './vector/vector'

export interface TerrainFeatureOptions {
    size: number
    erase: boolean
}

export class TerrainFeatureTool implements Tool<TerrainFeatureOptions> {
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

    pressDown(event: PressDownEvent, model: MapModel, options: TerrainFeatureOptions): DirtyRect | undefined {
        const resolution = Math.ceil(options.size / (8 * Math.PI)) + 3
        const circle = VectorFactory.circle(event.x, event.y, options.size, resolution, Math.random() * Math.PI)
        if (model.features.length === 0) {
            model.features.push({ type: 'forest', vector: new Vector([]) })
        }
        if (options.erase) {
            model.features[0].vector = model.features[0].vector.difference(circle)
        } else {
            model.features[0].vector = model.features[0].vector.union(circle)
        }
        return undefined
    }

    release(event: PressDownEvent, model: MapModel): DirtyRect | undefined {
        model.features[0].vector = model.features[0].vector.optimize()
        return undefined
    }

    render(
        currentCursorPosition: [number, number],
        options: TerrainFeatureOptions,
        rendering: CanvasRenderingContext2D
    ): void {
        rendering.beginPath()
        rendering.fillStyle = '#FFFFFF50'
        rendering.arc(currentCursorPosition[0], currentCursorPosition[1], options.size, 0, Math.PI * 2)
        rendering.fill()
    }
}

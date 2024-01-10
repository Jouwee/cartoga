import { get } from 'svelte/store'
import type { MapModel } from './map-model'
import { MapOperations } from './map-operations'
import { selectionStore } from './stores/selection.store'
import { DirtyRect, type PressDownEvent, type Tool, type ToolOption } from './tool'

interface SelectToolOptions {}

export class SelectTool implements Tool<SelectToolOptions> {
    private radius = 10
    constructor() {}

    getOptions(): ToolOption[] {
        return []
    }

    click(event: PressDownEvent, model: MapModel): DirtyRect | undefined {
        const point = new MapOperations(model).getNearestPoint(event.x, event.y, this.radius)
        if (point) {
            selectionStore.set(point)
            return DirtyRect.NO_PAINT
        }
        selectionStore.set(undefined)
        return DirtyRect.NO_PAINT
    }

    pressDown(event: PressDownEvent): DirtyRect | undefined {
        const selection = get(selectionStore)
        if (selection) {
            selection.x = event.x
            selection.y = event.y
            return undefined
        }
        return DirtyRect.NO_PAINT
    }

    release(): DirtyRect | undefined {
        return DirtyRect.NO_PAINT
    }

    render(
        currentCursorPosition: [number, number],
        options: SelectToolOptions,
        rendering: CanvasRenderingContext2D,
        model: MapModel
    ): void {
        const point = new MapOperations(model).getNearestPoint(
            currentCursorPosition[0],
            currentCursorPosition[1],
            this.radius
        )
        if (point) {
            rendering.strokeStyle = '#7EBDC3'
            rendering.lineWidth = 1
            rendering.strokeRect(point.x - this.radius, point.y - this.radius, this.radius * 2, this.radius * 2)
        }
        const selection = get(selectionStore)
        if (selection) {
            rendering.strokeStyle = '#7EBDC3'
            rendering.lineWidth = 2
            rendering.strokeRect(selection.x - this.radius, selection.y - this.radius, this.radius * 2, this.radius * 2)
        }
    }
}

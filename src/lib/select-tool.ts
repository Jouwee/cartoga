import type { MapModel, Point } from './map-model'
import { MapOperations } from './map-operations'
import { DirtyRect, type PressDownEvent, type Tool, type ToolOption } from './tool'

interface SelectToolOptions {}

export class SelectTool implements Tool<SelectToolOptions> {
    constructor(private onSelectionChanged: (type: 'none' | 'point', selection: undefined | Point) => void) {}

    getOptions(): ToolOption[] {
        return []
    }

    click(event: PressDownEvent, model: MapModel): DirtyRect | undefined {
        const point = new MapOperations(model).getNearestPoint(event.x, event.y, 5)
        if (point) {
            this.onSelectionChanged('point', point)
            return DirtyRect.NO_PAINT
        }
        this.onSelectionChanged('none', undefined)
        return DirtyRect.NO_PAINT
    }

    pressDown(): DirtyRect | undefined {
        return DirtyRect.NO_PAINT
    }
}

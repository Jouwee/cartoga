import { PointType, type MapModel } from './map-model'
import { MapOperations } from './map-operations'
import { DirtyRect, type PressDownEvent, type Tool, type ToolOption } from './tool'

const points = [
    { id: PointType.MajorCity, label: 'Major City' },
    { id: PointType.City, label: 'City' },
    { id: PointType.Town, label: 'Town' },
    { id: PointType.Village, label: 'Village' },
    { id: PointType.PointOfInterest, label: 'PointOfInterest' },
]

interface PointToolOptions {
    type: number
}

export class PointTool implements Tool<PointToolOptions> {
    getOptions(): ToolOption[] {
        return [
            {
                name: 'Type',
                key: 'type',
                type: 'enum',
                options: points,
            },
        ]
    }

    click(event: PressDownEvent, model: MapModel, options: PointToolOptions): DirtyRect | undefined {
        const point = new MapOperations(model).getNearestPoint(event.x, event.y, 5)
        if (point) {
            return DirtyRect.NO_PAINT
        } else {
            model.points.push({
                x: event.x,
                y: event.y,
                type: options.type,
            })
        }
        return undefined
    }

    pressDown(): DirtyRect | undefined {
        return DirtyRect.NO_PAINT
    }

    release(): DirtyRect | undefined {
        return DirtyRect.NO_PAINT
    }

    render(): void {}
}

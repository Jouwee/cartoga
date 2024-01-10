import type { MapModel } from './map-model'

export interface Tool<Options> {
    click(event: PressDownEvent, model: MapModel, options: Options): DirtyRect | undefined
    pressDown(event: PressDownEvent, model: MapModel, options: Options): DirtyRect | undefined
    release(event: PressDownEvent, model: MapModel, options: Options): DirtyRect | undefined
    render(
        currentCursorPosition: [number, number],
        options: Options,
        rendering: CanvasRenderingContext2D,
        model: MapModel
    ): void
    getOptions(): ToolOption[]
}

export interface GenericToolOption {
    key: string
    name: string
}

export interface NumberToolOption extends GenericToolOption {
    type: 'number'
    default: number
}

export interface NumberWithLimitsToolOption extends NumberToolOption {
    min: number
    max: number
    step: number
}

export interface BooleanToolOption extends GenericToolOption {
    type: 'boolean'
}

export interface EnumToolOption extends GenericToolOption {
    type: 'enum'
    options: Array<{ id: number | string; label: string }>
}

export type ToolOption = NumberToolOption | NumberWithLimitsToolOption | BooleanToolOption | EnumToolOption

export interface PressDownEvent {
    x: number
    y: number
}

export class DirtyRect {
    static NO_PAINT = new DirtyRect(0, 0, 0, 0)

    constructor(public x: number, public y: number, public width: number, public height: number) {}
}

import type { RenderingContext } from '$lib/stores/rendering.store'
import type { DirtyRect } from '$lib/tool'

export class RenderingProxy {
    constructor(
        private canvas: CanvasRenderingContext2D,
        private context: RenderingContext,
        private dirtyRect: DirtyRect
    ) {}

    getPixelAt(x: number, y: number): { r: number; g: number; b: number; a: number } {
        const cx = x * this.context.zoomMultiplier + this.context.pan.x
        const cy = y * this.context.zoomMultiplier + this.context.pan.y
        if (x >= 0 && x < 1200 && y >= 0 && y < 860) {
            const imageData = this.canvas.getImageData(cx, cy, 1, 1)
            return {
                r: imageData.data[0],
                g: imageData.data[1],
                b: imageData.data[2],
                a: imageData.data[3],
            }
        } else {
            return {
                r: 0,
                g: 0,
                b: 0,
                a: 0,
            }
        }
    }

    /** Canvas proxy */

    createPattern(image: CanvasImageSource, repetition: null | 'repeat') {
        return this.canvas.createPattern(image, repetition)
    }

    clearRect(x: number, y: number, w: number, h: number) {
        this.canvas.clearRect(x, y, w, h)
    }

    beginPath() {
        this.canvas.beginPath()
    }

    moveTo(x: number, y: number) {
        this.canvas.moveTo(
            x * this.context.zoomMultiplier + this.context.pan.x,
            y * this.context.zoomMultiplier + this.context.pan.y
        )
    }

    lineTo(x: number, y: number) {
        this.canvas.lineTo(
            x * this.context.zoomMultiplier + this.context.pan.x,
            y * this.context.zoomMultiplier + this.context.pan.y
        )
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
        this.canvas.quadraticCurveTo(
            cpx * this.context.zoomMultiplier + this.context.pan.x,
            cpy * this.context.zoomMultiplier + this.context.pan.y,
            x * this.context.zoomMultiplier + this.context.pan.x,
            y * this.context.zoomMultiplier + this.context.pan.y
        )
    }

    setLineDash(segments: Iterable<number>) {
        this.canvas.setLineDash(segments)
    }

    closePath() {
        this.canvas.closePath()
    }

    stroke() {
        this.canvas.stroke()
    }

    fill(fillRule?: CanvasFillRule) {
        this.canvas.fill(fillRule)
    }

    rect(x: number, y: number, w: number, h: number) {
        return this.canvas.rect(
            x * this.context.zoomMultiplier + this.context.pan.x,
            y * this.context.zoomMultiplier + this.context.pan.y,
            w * this.context.zoomMultiplier,
            h * this.context.zoomMultiplier
        )
    }
    strokeRect(x: number, y: number, w: number, h: number) {
        return this.canvas.strokeRect(
            x * this.context.zoomMultiplier + this.context.pan.x,
            y * this.context.zoomMultiplier + this.context.pan.y,
            w * this.context.zoomMultiplier,
            h * this.context.zoomMultiplier
        )
    }

    arc(
        x: number,
        y: number,
        radius: number,
        startAngle: number,
        endAngle: number,
        counterclockwise?: boolean | undefined
    ) {
        this.canvas.arc(
            x * this.context.zoomMultiplier + this.context.pan.x,
            y * this.context.zoomMultiplier + this.context.pan.y,
            radius * this.context.zoomMultiplier,
            startAngle,
            endAngle,
            counterclockwise
        )
    }

    fillText(text: string, x: number, y: number, maxWidth?: number | undefined) {
        this.canvas.fillText(
            text,
            x * this.context.zoomMultiplier + this.context.pan.x,
            y * this.context.zoomMultiplier + this.context.pan.y,
            maxWidth
        )
    }

    getImageData(x: number, y: number, w: number, h: number) {
        return this.canvas.getImageData(
            x * this.context.zoomMultiplier + this.context.pan.x,
            y * this.context.zoomMultiplier + this.context.pan.y,
            w * this.context.zoomMultiplier,
            h * this.context.zoomMultiplier
        )
    }

    drawImage(image: CanvasImageSource, dx: number, dy: number) {
        this.canvas.drawImage(
            image,
            dx * this.context.zoomMultiplier + this.context.pan.x,
            dy * this.context.zoomMultiplier + this.context.pan.y
        )
    }

    set fillStyle(v: string | CanvasGradient | CanvasPattern) {
        this.canvas.fillStyle = v
    }

    set strokeStyle(v: string) {
        this.canvas.strokeStyle = v
    }

    set filter(v: string) {
        this.canvas.filter = v
    }

    set lineWidth(v: number) {
        this.canvas.lineWidth = v
    }

    set textAlign(v: CanvasTextAlign) {
        this.canvas.textAlign = v
    }

    set font(v: string) {
        this.canvas.font = v
    }

    set lineCap(v: CanvasLineCap) {
        this.canvas.lineCap = v
    }
}

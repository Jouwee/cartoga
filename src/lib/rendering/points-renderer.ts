import { Assets } from '$lib/assets/asset-loader'
import { PointType, type MapModel } from '$lib/map-model'
import type { RenderingProxy } from './rendering-proxy'

export class PointsRenderer {
    private textures: Map<PointType, HTMLImageElement> = new Map()
    private nameOptions: Map<PointType, TextOptions> = new Map()

    async preload() {
        this.textures.set(PointType.MajorCity, Assets.majorCity)
        this.textures.set(PointType.City, Assets.city)
        this.textures.set(PointType.Town, Assets.town)
        this.textures.set(PointType.Village, Assets.village)
        this.textures.set(PointType.PointOfInterest, Assets.pointOfInterest)
        this.nameOptions.set(PointType.MajorCity, { render: true, fontSize: 14 })
        this.nameOptions.set(PointType.City, { render: true, fontSize: 12 })
        this.nameOptions.set(PointType.Town, { render: true, fontSize: 8 })
        this.nameOptions.set(PointType.Village, { render: false, fontSize: 0 })
        this.nameOptions.set(PointType.PointOfInterest, { render: true, fontSize: 8 })
    }

    render(model: MapModel, rendering: RenderingProxy) {
        rendering.clearRect(0, 0, 1200, 860)
        for (const point of model.points) {
            const img = this.textures.get(point.type)
            let height = 5
            if (img) {
                height = img.height
                rendering.drawImage(img, point.x - img.width / 2, point.y - img.height / 2)
            } else {
                rendering.strokeStyle = '#381d0a'
                rendering.beginPath()
                rendering.rect(point.x, point.y, 5, 5)
                rendering.stroke()
            }
            if ('name' in point && this.nameOptions.get(point.type)?.render) {
                rendering.filter = 'blur(2px)'
                rendering.textAlign = 'center'
                rendering.fillStyle = 'white'
                rendering.font = `${this.nameOptions.get(point.type)?.fontSize}px Eczar`
                rendering.fillText(new String(point.name).toString(), point.x, point.y + height)
                rendering.filter = 'none'
                rendering.fillStyle = '#381d0a'
                rendering.fillText(new String(point.name).toString(), point.x, point.y + height)
            }
        }
    }
}

interface TextOptions {
    render: boolean
    fontSize: number
}

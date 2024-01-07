import { PointType, type MapModel } from '$lib/map-model'

export class PointsRenderer {
    private textures: Map<PointType, HTMLImageElement> = new Map()
    private nameOptions: Map<PointType, TextOptions> = new Map()

    async preload() {
        const majorCityTexture = new Image()
        majorCityTexture.src = '/images/map/settlement-major-city.png'
        this.textures.set(PointType.MajorCity, majorCityTexture)
        const cityTexture = new Image()
        cityTexture.src = '/images/map/settlement-city.png'
        this.textures.set(PointType.City, cityTexture)
        const townTexture = new Image()
        townTexture.src = '/images/map/settlement-town.png'
        this.textures.set(PointType.Town, townTexture)
        const villageTexture = new Image()
        villageTexture.src = '/images/map/settlement-village.png'
        this.textures.set(PointType.Village, villageTexture)
        const pointOfInterestTexture = new Image()
        pointOfInterestTexture.src = '/images/map/settlement-poi.png'
        this.textures.set(PointType.PointOfInterest, pointOfInterestTexture)
        this.nameOptions.set(PointType.MajorCity, { render: true, fontSize: 14 })
        this.nameOptions.set(PointType.City, { render: true, fontSize: 12 })
        this.nameOptions.set(PointType.Town, { render: true, fontSize: 8 })
        this.nameOptions.set(PointType.Village, { render: false, fontSize: 0 })
        this.nameOptions.set(PointType.PointOfInterest, { render: true, fontSize: 8 })
    }

    render(model: MapModel, rendering: CanvasRenderingContext2D) {
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

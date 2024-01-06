import type { MapModel, Point } from './map-model'

export class MapOperations {
    constructor(private model: MapModel) {}

    getNearestPoint(x: number, y: number, radius: number): Point | undefined {
        const radiusSqrd = radius * radius
        let closest: Point | undefined = undefined
        let closestDst: number = Infinity
        for (const point of this.model.points) {
            const dstSqrd = (point.x - x) * (point.x - x) + (point.y - y) * (point.y - y)
            if (dstSqrd <= radiusSqrd && dstSqrd < closestDst) {
                closest = point
                closestDst = dstSqrd
            }
        }
        return closest
    }
}

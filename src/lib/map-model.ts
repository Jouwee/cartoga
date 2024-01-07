import { Vector, type Polygon } from './vector/vector'

export enum PointType {
    Point = 0,
    MajorCity = 1,
    City = 2,
    Town = 3,
    Village = 4,
    PointOfInterest = 99,
}

export interface Settlement {
    type: PointType.MajorCity | PointType.City | PointType.Town | PointType.Village
    name: string
}

export interface Point {
    x: number
    y: number
    type: PointType
}

export interface Terrain {
    vector: Vector
}

export class MapModel {
    version: number = 1
    terrain: Terrain = {
        vector: new Vector([]),
    }
    features: Array<{
        type: 'forest'
        vector: Vector
    }> = []
    paths: Polygon[] = []
    points: Point[] = []
}

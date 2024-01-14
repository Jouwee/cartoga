import { Telemetry } from '$lib/telemetry/telemetry'
import { PolygonBoolean } from './polybool.interop'
import polygonClipping from 'polygon-clipping'

export class Vector {
    polygons: Polygon[] = []
    unoptimizedUnionVectors: Vector[] = []

    constructor(polygons: Polygon[]) {
        this.polygons = polygons
    }

    fastUnion(another: Vector) {
        const clone = new Vector(this.polygons)
        clone.unoptimizedUnionVectors = this.unoptimizedUnionVectors.concat([another])
        return clone
    }

    union(another: Vector): Vector {
        Telemetry.timerStart('Vector union polybool')
        const unionResult = PolygonBoolean.union(
            {
                regions: this.polygons.map(p => p.nodes),
                inverted: false,
            },
            {
                regions: another.polygons.map(p => p.nodes),
                inverted: false,
            }
        )
        const newVector = new Vector(unionResult.regions.map(r => ({ nodes: r })))
        Telemetry.timerEnd('Vector union polybool')
        // Telemetry.timerStart('Vector union polygonClipping')
        // const union = polygonClipping.union(
        //     this.polygons.map(p => p.nodes),
        //     another.polygons.map(p => p.nodes)
        // )
        // const polygons = []
        // for (let i = 0; i < union.length; i++) {
        //     for (let j = 0; j < union[i].length; j++) {
        //         polygons.push({ nodes: union[i][j] })
        //     }
        // }
        // // console.log(polygons)
        // const unionVector = new Vector(polygons)
        // Telemetry.timerEnd('Vector union polygonClipping')
        return newVector
    }

    intersect(another: Vector): Vector {
        const unionResult = PolygonBoolean.intersect(
            {
                regions: this.polygons.map(p => p.nodes),
                inverted: false,
            },
            {
                regions: another.polygons.map(p => p.nodes),
                inverted: false,
            }
        )
        return new Vector(unionResult.regions.map(r => ({ nodes: r })))
    }

    difference(another: Vector): Vector {
        const unionResult = PolygonBoolean.difference(
            {
                regions: this.polygons.map(p => p.nodes),
                inverted: false,
            },
            {
                regions: another.polygons.map(p => p.nodes),
                inverted: false,
            }
        )
        return new Vector(unionResult.regions.map(r => ({ nodes: r })))
    }

    xor(another: Vector): Vector {
        const unionResult = PolygonBoolean.xor(
            {
                regions: this.polygons.map(p => p.nodes),
                inverted: false,
            },
            {
                regions: another.polygons.map(p => p.nodes),
                inverted: false,
            }
        )
        return new Vector(unionResult.regions.map(r => ({ nodes: r })))
    }

    optimize(): Vector {
        let vector = new Vector(this.polygons)
        for (const another of this.unoptimizedUnionVectors) {
            vector = vector.union(another)
        }
        return vector
    }
}

export interface Polygon {
    nodes: Node[]
}

export type Node = [number, number]

export class VectorFactory {
    static square(x: number, y: number, w: number, h: number): Vector {
        return new Vector([
            {
                nodes: [
                    [x, y],
                    [x + w, y],
                    [x + w, y + h],
                    [x, y + h],
                ],
            },
        ])
    }

    static circle(x: number, y: number, r: number, resolution: number, startingAngle: number = 0): Vector {
        const polygon: Polygon = { nodes: [] }
        for (let i = 0; i < Math.PI * 2; i += Math.PI / resolution) {
            const angle = i + startingAngle
            polygon.nodes.push([x + Math.cos(angle) * r, y + Math.sin(angle) * r])
        }
        return new Vector([polygon])
    }
}

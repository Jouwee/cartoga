import * as PolyBool from 'polybooljs'

export class PolygonBoolean {
    static union(poly1: PolyboolPolygon, poly2: PolyboolPolygon): PolyboolPolygon {
        return PolyBool.union(poly1, poly2)
    }
    static intersect(poly1: PolyboolPolygon, poly2: PolyboolPolygon): PolyboolPolygon {
        return PolyBool.intersect(poly1, poly2)
    }
    static difference(poly1: PolyboolPolygon, poly2: PolyboolPolygon): PolyboolPolygon {
        return PolyBool.difference(poly1, poly2)
    }
    static differenceRev(poly1: PolyboolPolygon, poly2: PolyboolPolygon): PolyboolPolygon {
        return PolyBool.differenceRev(poly1, poly2)
    }
    static xor(poly1: PolyboolPolygon, poly2: PolyboolPolygon): PolyboolPolygon {
        return PolyBool.xor(poly1, poly2)
    }
}

type PolyboolPolygon = {
    regions: [number, number][][]
    inverted: boolean
}

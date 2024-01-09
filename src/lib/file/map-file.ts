import { MapModel } from '$lib/map-model'
import { Vector } from '$lib/vector/vector'
import posthog from 'posthog-js'

export class MapFile {
    static newMap() {
        return new MapModel()
    }

    static async uploadMap() {
        const content = await MapFile.fileDialog()
        const model = new MapModel()
        if (typeof content === 'string') {
            Object.assign(model, JSON.parse(content))
            model.terrain.vector = new Vector(model.terrain.vector.polygons)
            model.features.forEach(f => {
                f.vector = new Vector(f.vector.polygons)
            })
            return model
        }
        return undefined
    }

    static async fileDialog(): Promise<string | ArrayBuffer | undefined> {
        return new Promise(resolve => {
            const input = document.createElement('input')
            input.type = 'file'
            input.onchange = () => {
                const fileList = input.files
                if (fileList) {
                    const reader = new FileReader()
                    reader.onload = function (theFile) {
                        return resolve(theFile.target?.result || '')
                    }
                    return reader.readAsText(fileList[0])
                }
                return resolve(undefined)
            }
            input.click()
        })
    }

    static downloadMap(model: MapModel) {
        const ahref = document.createElement('a')
        posthog.capture('save_map', { model })
        ahref.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(model))
        ahref.download = 'map.json'
        ahref.click()
    }
}

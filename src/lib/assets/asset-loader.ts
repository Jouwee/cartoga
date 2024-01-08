export class Assets {
    static water: HTMLImageElement
    static grass: HTMLImageElement
    static majorCity: HTMLImageElement
    static city: HTMLImageElement
    static town: HTMLImageElement
    static village: HTMLImageElement
    static pointOfInterest: HTMLImageElement
    static tree: HTMLImageElement

    static async preload(progressWatcher: (progress: number, text: string) => void) {
        const total = 8
        let i = 0
        progressWatcher(i++ / total, 'Loading water.png')
        Assets.water = await Assets.loadImage('/images/map/water.png')
        progressWatcher(i++ / total, 'Loading grass.png')
        Assets.grass = await Assets.loadImage('/images/map/grass.png')
        progressWatcher(i++ / total, 'Loading settlement-major-city.png')
        Assets.majorCity = await Assets.loadImage('/images/map/settlement-major-city.png')
        progressWatcher(i++ / total, 'Loading settlement-city.png')
        Assets.city = await Assets.loadImage('/images/map/settlement-city.png')
        progressWatcher(i++ / total, 'Loading settlement-town.png')
        Assets.town = await Assets.loadImage('/images/map/settlement-town.png')
        progressWatcher(i++ / total, 'Loading settlement-village.png')
        Assets.village = await Assets.loadImage('/images/map/settlement-village.png')
        progressWatcher(i++ / total, 'Loading settlement-poi.png')
        Assets.pointOfInterest = await Assets.loadImage('/images/map/settlement-poi.png')
        progressWatcher(i++ / total, 'Loading tree-1.png')
        Assets.tree = await Assets.loadImage('/images/map/tree-1.png')
    }

    static async loadImage(path: string) {
        const image = new Image()
        const loadPromise = new Promise<void>(resolve => (image.onload = resolve))
        image.src = Assets.getPath(path)
        await loadPromise
        return image
    }

    static getPath(path: string): string {
        if (document.location.href.includes('github')) {
            return '/cartoga' + path
        } else {
            return path
        }
    }
}

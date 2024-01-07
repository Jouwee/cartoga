export class Assets {
    static getPath(path: string): string {
        if (document.location.href.includes('github')) {
            return '/cartoga' + path
        } else {
            return path
        }
    }
}

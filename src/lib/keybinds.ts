export class Keybinds {
    static listeners: Array<Keybind & { callback: () => void }> = []

    static {
        document.addEventListener('keydown', evt => {
            console.log(evt.key)
            for (const listener of Keybinds.listeners) {
                if (evt.key === listener.key) {
                    listener.callback()
                }
            }
        })
    }

    static register(keybind: Keybind, callback: () => void) {
        this.listeners.push({ key: keybind.key, modifiers: keybind.modifiers, callback })
    }
}

interface Keybind {
    key: string
    modifiers?: Array<'shift' | 'ctrl' | 'alt'>
}

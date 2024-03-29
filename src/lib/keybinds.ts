export class Keybinds {
    static listeners: Array<Keybind & { callback: () => void }> = []

    static {
        if (typeof document !== 'undefined') {
            document.addEventListener('keydown', evt => {
                if (evt.target && 'tagName' in evt.target && evt.target.tagName === 'INPUT') {
                    return
                }
                for (const listener of Keybinds.listeners) {
                    if (evt.key === listener.key) {
                        listener.callback()
                    }
                }
            })
        } else {
            console.error('No document on keybind registration. No keybinds will work')
        }
    }

    static register(keybind: Keybind, callback: () => void) {
        this.listeners.push({ key: keybind.key, modifiers: keybind.modifiers, callback })
    }
}

interface Keybind {
    key: string | 'Delete'
    modifiers?: Array<'shift' | 'ctrl' | 'alt'>
}

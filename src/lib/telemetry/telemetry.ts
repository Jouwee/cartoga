export class Telemetry {
    static openTimers: Array<{ key: string; start: number }> = []

    static telemetryData: {
        [key: string]: {
            key: string
            calls: Array<{ key: string; start: number; end: number }>
            callsPerSecond: number
            averageMsPerCall: number
            maxMsPerCall: number
            busyTime: number
        }
    } = {}

    static {
        setInterval(() => {
            const time = 60_000
            const start = new Date().getTime() - time
            Object.values(Telemetry.telemetryData).forEach(r => {
                r.calls = r.calls.filter(c => c.start >= start)
                r.callsPerSecond = r.calls.length / 10
                r.averageMsPerCall = r.calls.reduce((acc, c) => acc + c.end - c.start, 0) / r.calls.length
                r.maxMsPerCall = r.calls.reduce((acc, c) => Math.max(acc, c.end - c.start), 0)
                r.busyTime = r.calls.reduce((acc, c) => acc + c.end - c.start, 0) / time
            })
        }, 5000)
    }

    static timerStart(key: string) {
        Telemetry.openTimers.push({
            key,
            start: new Date().getTime(),
        })
    }

    static timerEnd(key: string) {
        const openTimerIndex = Telemetry.openTimers.findIndex(t => t.key === key)
        if (openTimerIndex < 0) {
            return
        }
        const openTimer = Telemetry.openTimers[openTimerIndex]
        Telemetry.openTimers.splice(openTimerIndex, 1)
        Telemetry.telemetryData[key] = Telemetry.telemetryData[key] ?? {
            key,
            calls: [],
            callsPerSecond: 0,
            averageMsPerCall: 0,
            maxMsPerCall: 0,
            busyTime: 0,
        }
        Telemetry.telemetryData[key].calls.push({ key, start: openTimer.start, end: new Date().getTime() })
    }

    static print() {
        console.log(['key', 'calls', 'busyTime', 'averageMsPerCall', 'callsPerSecond', 'maxMsPerCall'].join('\t'))
        Object.values(Telemetry.telemetryData)
            .sort((a, b) => b.busyTime - a.busyTime)
            .forEach(r => {
                console.log(
                    [
                        r.key,
                        r.calls.length,
                        r.busyTime.toFixed(2),
                        r.averageMsPerCall.toFixed(2),
                        r.callsPerSecond.toFixed(2),
                        r.maxMsPerCall.toFixed(2),
                    ].join('\t')
                )
            })
    }
}

if (typeof document !== 'undefined') {
    document.printTelemetry = () => Telemetry.print()
}

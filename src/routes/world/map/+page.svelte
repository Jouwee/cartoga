<script lang="ts">
    import { MapModel, type Point } from '$lib/map-model'
    import { MapRenderer } from '$lib/map-renderer'
    import type { Tool } from '$lib/tool'
    import Toolbar from '$lib/components/toolbar.component.svelte'
    import Map from '$lib/components/map.component.svelte'
    import ToolbarOptions from '$lib/components/toolbar-options.component.svelte'
    import { Vector } from '$lib/vector/vector'

    let selectedPoint: Point | undefined
    let selectedTool: Tool<unknown>
    let toolOptions: { [key: string]: any } = {}
    let downloadHref: string = ''
    let files: FileList
    let map: Map
    $: if (files) {
        console.log(files)
        for (const file of files) {
            console.log(`${file.name}: ${file.size} bytes`)
        }
    }

    const model = new MapModel()

    function click(evt: any) {
        let dirtyRect = selectedTool.click(evt.detail, model, toolOptions as any)
        map.render(dirtyRect)
        updateDownloadHref()
    }

    function pressDown(evt: any) {
        let dirtyRect = selectedTool.pressDown(evt.detail, model, toolOptions as any)
        map.render(dirtyRect)
        updateDownloadHref()
    }

    function move(evt: any) {
        map.renderTool(selectedTool, [evt.detail.x, evt.detail.y], toolOptions)
    }

    function release(evt: any) {
        let dirtyRect = selectedTool.release(evt.detail, model, toolOptions as any)
        map.render(dirtyRect)
        updateDownloadHref()
    }

    let downloadTimeout: undefined | any
    function updateDownloadHref() {
        if (downloadTimeout) {
            clearTimeout(downloadTimeout)
        }
        downloadTimeout = setTimeout(() => {
            downloadHref = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(model))
        }, 100)
    }

    function upload() {
        if (!files) {
            return
        }
        let reader = new FileReader()
        reader.onload = function (theFile) {
            console.log(JSON.parse(theFile.target?.result || ''))
            Object.assign(model, JSON.parse(theFile.target?.result || ''))
            model.terrain.vector = new Vector(model.terrain.vector.polygons)
            map.render()
            updateDownloadHref()
        }
        reader.readAsText(files[0])
        return undefined
    }
</script>

<Toolbar on:toolSelected={t => (selectedTool = t.detail)} bind:selectedPoint />
<Map {model} bind:this={map} on:click={click} on:pressDown={pressDown} on:move={move} on:release={release} />

<div class="sidebar">
    <ToolbarOptions {selectedTool} {selectedPoint} on:optionsChanged={o => (toolOptions = o.detail)} />

    <a href={downloadHref} download="map.json">Download</a>
    <input bind:files id="many" type="file" />
    <button on:click={upload}>Upload</button>

    <pre>
        Terrain nodes: TODO
    </pre>
</div>

<style>
    .sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        width: 200px;
        display: flex;
        flex-direction: column;
        background: var(--surface-1);
        padding: 0.5rem;
    }
</style>

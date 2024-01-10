<script lang="ts">
    import { MapFile } from '$lib/file/map-file'
    import { Keybinds } from '$lib/keybinds'
    import type { MapModel, Point } from '$lib/map-model'
    import { PointTool } from '$lib/point-tool'
    import { SelectTool } from '$lib/select-tool'
    import { TerrainFeatureTool } from '$lib/terrain-feature-tool'
    import { TerrainTool } from '$lib/terrain-tool'
    import { PathTool } from '$lib/tools/path-tool'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    const tools = {
        select: new SelectTool(),
        terrain: new TerrainTool(),
        point: new PointTool(),
        forest: new TerrainFeatureTool(),
        path: new PathTool(),
    }
    export let selectedToolKey: keyof typeof tools = 'terrain'
    export let model: MapModel
    $: {
        dispatch('toolSelected', tools[selectedToolKey])
    }
    // TODO: Yuck
    setTimeout(() => {
        dispatch('toolSelected', tools[selectedToolKey])
    }, 200)

    function newMap() {
        dispatch('modelReplaced', MapFile.newMap())
    }

    async function uploadMap() {
        const map = await MapFile.uploadMap()
        if (map) {
            dispatch('modelReplaced', map)
        }
    }

    function downloadMap() {
        MapFile.downloadMap(model)
    }

    Keybinds.register({ key: 's' }, () => (selectedToolKey = 'select'))
    Keybinds.register({ key: 't' }, () => (selectedToolKey = 'terrain'))
    Keybinds.register({ key: 'e' }, () => (selectedToolKey = 'point'))
    Keybinds.register({ key: 'f' }, () => (selectedToolKey = 'forest'))
    Keybinds.register({ key: 'p' }, () => (selectedToolKey = 'path'))
</script>

<div class="toolbar">
    <button on:click={newMap} title="New map"><i class="fa fa-file" /></button>
    <button on:click={downloadMap} title="Save map"><i class="fa fa-floppy-disk" /></button>
    <button on:click={uploadMap} title="Upload map"><i class="fa fa-folder-open" /></button>
    <hr />
    <button
        on:click={() => (selectedToolKey = 'select')}
        class:selected={selectedToolKey === 'select'}
        title="Selection tool (S)"><i class="fa fa-arrow-pointer" /></button
    >
    <button
        on:click={() => (selectedToolKey = 'terrain')}
        class:selected={selectedToolKey === 'terrain'}
        title="Terrain tool (T)"><i class="fa fa-paintbrush" /></button
    >
    <button
        on:click={() => (selectedToolKey = 'point')}
        class:selected={selectedToolKey === 'point'}
        title="Settlement tool (E)"><i class="fa fa-landmark" /></button
    >
    <button
        on:click={() => (selectedToolKey = 'forest')}
        class:selected={selectedToolKey === 'forest'}
        title="Forest tool (F)"><i class="fa fa-tree" /></button
    >
    <button
        on:click={() => (selectedToolKey = 'path')}
        class:selected={selectedToolKey === 'path'}
        title="Path tool (P)"><i class="fa fa-road" /></button
    >
</div>

<style>
    .toolbar {
        background: var(--surface-1);
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        z-index: 1;
    }

    .toolbar button {
        width: 3rem;
        height: 3rem;
        background-color: var(--surface-1);
        color: var(--text);
        border: none;
        transition: background-color var(--transition), color var(--transition);
        cursor: pointer;
    }

    .toolbar button:hover {
        background-color: var(--surface-2);
    }

    .toolbar button.selected {
        background-color: var(--primary);
        color: var(--primary-contrast);
    }

    .toolbar hr {
        border-top: 1px solid var(--surface-2);
        color: transparent;
        width: 2.5rem;
    }
</style>

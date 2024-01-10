<script lang="ts">
    import { MapModel, type Point } from '$lib/map-model'
    import type { Tool } from '$lib/tool'
    import Toolbar from '$lib/components/toolbar.component.svelte'
    import Map from '$lib/components/map.component.svelte'
    import ToolbarOptions from '$lib/components/toolbar-options.component.svelte'
    import { Keybinds } from '$lib/keybinds'
    import { selectionStore } from '$lib/stores/selection.store'
    import { get } from 'svelte/store'

    let selectedTool: Tool<unknown>
    let toolOptions: { [key: string]: any } = {}
    let map: Map

    let model = new MapModel()

    function click(evt: any) {
        let dirtyRect = selectedTool.click(evt.detail, model, toolOptions as any)
        map.render(dirtyRect)
    }

    function pressDown(evt: any) {
        let dirtyRect = selectedTool.pressDown(evt.detail, model, toolOptions as any)
        map.render(dirtyRect)
        map.renderTool(selectedTool, [evt.detail.x, evt.detail.y], toolOptions)
    }

    function move(evt: any) {
        map.renderTool(selectedTool, [evt.detail.x, evt.detail.y], toolOptions)
    }

    function release(evt: any) {
        let dirtyRect = selectedTool.release(evt.detail, model, toolOptions as any)
        map.render(dirtyRect)
    }

    function modelChanged(evt: any) {
        model = evt.detail
        // TODO: Yuck
        setTimeout(() => {
            map.render(undefined)
        })
    }

    Keybinds.register({ key: 'Delete' }, () => {
        const selection = get(selectionStore)
        if (selection) {
            model.points = model.points.filter(p => p !== selection)
            selectionStore.set(undefined)
            map.render(undefined)
            map.renderTool(selectedTool, [-1, -1], toolOptions)
        }
    })
</script>

<Toolbar {model} on:toolSelected={t => (selectedTool = t.detail)} on:modelReplaced={modelChanged} />
<Map {model} bind:this={map} on:click={click} on:pressDown={pressDown} on:move={move} on:release={release} />

<div class="sidebar">
    <ToolbarOptions
        {selectedTool}
        on:optionsChanged={o => (toolOptions = o.detail)}
        on:render={() => map.render(undefined)}
    />
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
        padding: 1rem;
    }
</style>

<script lang="ts">
    import type { Point } from '$lib/map-model'
    import { PointTool } from '$lib/point-tool'
    import { PolygonTool } from '$lib/polygon-tool'
    import { SelectTool } from '$lib/select-tool'
    import { TerrainTool } from '$lib/terrain-tool'
    import { createEventDispatcher, onMount } from 'svelte'
    const dispatch = createEventDispatcher()
    const tools = {
        select: new SelectTool((type, selection) => (selectedPoint = selection)),
        terrain: new TerrainTool(),
        point: new PointTool(),
        forest: new PolygonTool('forest', true),
    }
    export let selectedToolKey: keyof typeof tools = 'terrain'
    $: {
        dispatch('toolSelected', tools[selectedToolKey])
    }
    // TODO: Yuck
    setTimeout(() => {
        dispatch('toolSelected', tools[selectedToolKey])
    }, 200)
    // TODO: Não faz muito sentido isso ficar aqui
    export let selectedPoint: Point | undefined = undefined
</script>

<div class="toolbar">
    <button on:click={() => (selectedToolKey = 'select')} class:selected={selectedToolKey === 'select'}
        ><i class="fa fa-arrow-pointer" /></button
    >
    <button on:click={() => (selectedToolKey = 'terrain')} class:selected={selectedToolKey === 'terrain'}
        ><i class="fa fa-paintbrush" /></button
    >
    <button on:click={() => (selectedToolKey = 'point')} class:selected={selectedToolKey === 'point'}
        ><i class="fa fa-landmark" /></button
    >
    <button on:click={() => (selectedToolKey = 'forest')} class:selected={selectedToolKey === 'forest'}
        ><i class="fa fa-tree" /></button
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
    }

    .toolbar button.selected {
        background-color: var(--primary);
        color: var(--primary-contrast);
    }
</style>

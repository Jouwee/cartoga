<script lang="ts">
    import { Keybinds } from '$lib/keybinds'
    import type { Point } from '$lib/map-model'
    import { PointTool } from '$lib/point-tool'
    import { SelectTool } from '$lib/select-tool'
    import { TerrainFeatureTool } from '$lib/terrain-feature-tool'
    import { TerrainTool } from '$lib/terrain-tool'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    const tools = {
        select: new SelectTool((type, selection) => (selectedPoint = selection)),
        terrain: new TerrainTool(),
        point: new PointTool(),
        forest: new TerrainFeatureTool(),
    }
    export let selectedToolKey: keyof typeof tools = 'terrain'
    $: {
        dispatch('toolSelected', tools[selectedToolKey])
    }
    // TODO: Yuck
    setTimeout(() => {
        dispatch('toolSelected', tools[selectedToolKey])
    }, 200)

    Keybinds.register({ key: 's' }, () => (selectedToolKey = 'select'))
    Keybinds.register({ key: 't' }, () => (selectedToolKey = 'terrain'))
    Keybinds.register({ key: 'p' }, () => (selectedToolKey = 'point'))
    Keybinds.register({ key: 'f' }, () => (selectedToolKey = 'forest'))

    // TODO: Não faz muito sentido isso ficar aqui
    export let selectedPoint: Point | undefined = undefined
</script>

<div class="toolbar">
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
        title="Settlement tool (P)"><i class="fa fa-landmark" /></button
    >
    <button
        on:click={() => (selectedToolKey = 'forest')}
        class:selected={selectedToolKey === 'forest'}
        title="Forest tool (F)"><i class="fa fa-tree" /></button
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
</style>

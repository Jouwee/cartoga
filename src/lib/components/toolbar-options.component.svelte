<script lang="ts">
    import { PointTypeNames, type Point } from '$lib/map-model'
    import { selectionStore } from '$lib/stores/selection.store'
    import type { Tool, ToolOption } from '$lib/tool'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    let selectedPoint: Point | undefined
    selectionStore.subscribe(selection => {
        selectedPoint = selection
    })
    export let selectedTool: Tool<unknown>
    let options: ToolOption[]
    const toolOptions: { [key: string]: any } = {}
    $: dispatch('optionsChanged', toolOptions)
    $: {
        options = selectedTool?.getOptions()
        if (options) {
            options = selectedTool.getOptions()
            for (const option of options) {
                if ('default' in option) toolOptions[option.key] = toolOptions[option.key] ?? option.default
            }
        }
        dispatch('optionsChanged', toolOptions)
    }
</script>

{#if selectedTool}
    <h2>Tool options</h2>
    {#each selectedTool.getOptions() as toolOption, i}
        <div class="option">
            <label for={toolOption.key}>{toolOption.name}</label>
            {#if toolOption.type === 'number'}
                <input bind:value={toolOptions[toolOption.key]} name={toolOption.key} type="number" />
                {#if 'min' in toolOption}
                    <input
                        bind:value={toolOptions[toolOption.key]}
                        name={toolOption.key}
                        type="range"
                        min={toolOption.min}
                        max={toolOption.max}
                        step={toolOption.step}
                    />
                {/if}
            {/if}
            {#if toolOption.type === 'boolean'}
                <input bind:checked={toolOptions[toolOption.key]} name={toolOption.key} type="checkbox" />
            {/if}
            {#if toolOption.type === 'enum'}
                <select bind:value={toolOptions[toolOption.key]} name={toolOption.key}>
                    {#each toolOption.options as option}
                        <option value={option.id}>{option.label}</option>
                    {/each}
                </select>
            {/if}
        </div>
    {/each}
{/if}

{#if selectedPoint !== undefined}
    <h2>Selected: {PointTypeNames[selectedPoint.type]}</h2>
    {#if 'name' in selectedPoint}
        <div class="option">
            <label for="name">Name</label>
            <input bind:value={selectedPoint.name} on:change={() => dispatch('render')} name="name" type="text" />
        </div>
    {/if}
{/if}

<style>
    .option {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        justify-content: stretch;
        margin-bottom: 0.5rem;
        align-items: center;
    }

    .option label {
        min-width: 50px;
    }

    .option input,
    .option select {
        min-width: 0;
        flex-grow: 1;
    }

    h2 {
        font-size: 0.875em;
        font-weight: bold;
    }
</style>

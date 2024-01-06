<script lang="ts">
    import type { Point } from '$lib/map-model'
    import type { Tool, ToolOption } from '$lib/tool'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    export let selectedPoint: Point | undefined
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

{#if selectedPoint !== undefined && 'name' in selectedPoint}
    <input bind:value={selectedPoint.name} type="text" />
{/if}

<style>
    .option {
        display: grid;
        grid-template-columns: 60px 60px 60px;
        column-gap: 0.5rem;
        margin-bottom: 0.5rem;
        align-items: center;
    }
</style>

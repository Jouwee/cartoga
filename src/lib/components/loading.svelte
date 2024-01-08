<script lang="ts">
    export let progress: number = 0
    export let message: string = 'Loading'
</script>

<div class="loading">
    <div class="progress">
        <div class="progress-complete" style="width: {progress * 100}%" />
        <span>{progress * 100}%</span>
    </div>
    <span>{message}</span>
</div>

<style>
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--base);
        z-index: 9;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .progress {
        position: relative;
        width: 400px;
        height: 30px;
        background-color: var(--surface-1);
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .progress span {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
    }

    .progress-complete {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background-color: var(--primary);
    }
</style>

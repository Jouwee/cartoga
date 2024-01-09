<section class="hero">
    <h1>Map your world</h1>
    <p>Make the world in your head a reality with Cartoga's incredible fantasy map-making tool.</p>
    <p>Ideal for tabletop games, fantasy authors and cartographers alike.</p>
    <a href="world/map">Start cartographing</a>
    <img src="images/hero-shot.png" alt="Cartoga's map making tool" />
</section>
<footer>
    <a href="https://github.com/Jouwee/cartoga" aria-label="Visit Github page"><i class="fab fa-github" /> Github</a>
</footer>

<style>
    section.hero {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        padding: calc(50vh - 232px) calc(50vw - 550px);
        column-gap: 4rem;
        row-gap: 1rem;
    }

    section.hero h1 {
        font-size: 3rem;
        margin: 0;
    }

    section.hero p {
        font-size: 1.25rem;
    }

    section.hero img {
        grid-column: 2 / 3;
        grid-row: 1 / 8;
        width: 100%;
        box-shadow: 10px 10px 30px 1px rgba(0, 0, 0, 0.33);
    }

    section.hero a {
        font-size: 1.5rem;
        color: var(--text);
        background-color: var(--surface-1);
        border: 1px solid var(--primary);
        padding: 1rem;
        text-align: center;
        text-decoration: none;
    }

    footer {
        display: grid;
        justify-content: center;
        padding: 3rem;
    }

    footer a {
        color: var(--text);
        text-decoration: none;
    }

    footer a:hover {
        text-decoration: underline;
    }
</style>

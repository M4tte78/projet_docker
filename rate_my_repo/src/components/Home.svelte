<script>
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    
    import './Home.css'; 
    let repoUrl = '';
    let isLoading = false;
    let showError = false;
    let errorMessage = '';

    function handleSubmit() {
        if (!repoUrl) {
            showError = true;
            errorMessage = 'Veuillez entrer une URL de dépôt GitHub';
            return;
        }

        const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
        if (!githubUrlPattern.test(repoUrl)) {
            showError = true;
            errorMessage = 'Veuillez entrer une URL valide de dépôt GitHub';
            return;
        }

        showError = false;
        isLoading = true;
        
        setTimeout(() => {
            isLoading = false;
            window.location.href = `/analyze?repo=${encodeURIComponent(repoUrl)}`;
        }, 1500);
    }

    let stars = [];
    let branches = [];
    
    onMount(() => {
        for (let i = 0; i < 20; i++) {
            stars.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                duration: Math.random() * 3000 + 2000
            });
        }
        
        for (let i = 0; i < 8; i++) {
            branches.push({
                id: i,
                x1: Math.random() * 30,
                y1: Math.random() * 100,
                length: Math.random() * 30 + 10,
                angle: Math.random() * 60 - 30,
                duration: Math.random() * 4000 + 3000
            });
        }
    });
</script>

<div class="container">
    <div class="background-animations">
        {#each stars as star (star.id)}
            <div class="star" 
                style="left: {star.x}%; top: {star.y}%; width: {star.size}px; height: {star.size}px; 
                       animation-duration: {star.duration}ms;">
            </div>
        {/each}
        
        {#each branches as branch (branch.id)}
            <div class="branch" 
                style="left: {branch.x1}%; top: {branch.y1}%; width: {branch.length}px; 
                       transform: rotate({branch.angle}deg); 
                       animation-duration: {branch.duration}ms;">
            </div>
        {/each}
    </div>

    <header in:fly={{ y: -50, duration: 1000, easing: quintOut }}>
        <div class="logo">
            <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
                <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <h1>Note Mon Dépôt</h1>
        </div>
    </header>

    <main>
        <section class="hero" in:fade={{ delay: 300, duration: 800 }}>
            <h2>Analyse de dépôt GitHub alimentée par l'IA</h2>
            <p>Obtenez des retours détaillés, une analyse des commits et une évaluation de qualité pour n'importe quel dépôt GitHub</p>
        </section>

        <section class="search-section" in:fade={{ delay: 600, duration: 800 }}>
            <form on:submit|preventDefault={handleSubmit}>
                <div class="search-container">
                    <input 
                        type="text" 
                        bind:value={repoUrl} 
                        placeholder="Entrez l'URL du dépôt GitHub (ex. : https://github.com/nomutilisateur/depot)"
                        class:error={showError}
                    />
                    <button type="submit" class:loading={isLoading}>
                        {#if isLoading}
                            <div class="spinner"></div>
                        {:else}
                            Analyser
                        {/if}
                    </button>
                </div>
                {#if showError}
                    <p class="error-message" in:fade>{errorMessage}</p>
                {/if}
            </form>
        </section>

        <section class="features" in:fade={{ delay: 900, duration: 800 }}>
            <div class="feature">
                <div class="feature-icon">
                    <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
                        <path fill-rule="evenodd" d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z"></path>
                    </svg>
                </div>
                <h3>Analyse de code par IA</h3>
                <p>Notre IA analyse la qualité du code, la structure et les motifs pour fournir des informations utiles</p>
            </div>
            <div class="feature">
                <div class="feature-icon">
                    <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
                        <path fill-rule="evenodd" d="M10.5 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm.061 3.073a4 4 0 10-5.123 0 6.004 6.004 0 00-3.431 5.142.75.75 0 001.498.07 4.5 4.5 0 018.99 0 .75.75 0 101.498-.07 6.005 6.005 0 00-3.432-5.142z"></path>
                    </svg>
                </div>
                <h3>Évaluation des contributeurs</h3>
                <p>Évaluez les contributions individuelles et les styles de codage de chaque membre de l'équipe</p>
            </div>
            <div class="feature">
                <div class="feature-icon">
                    <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
                        <path fill-rule="evenodd" d="M2.5 3.5c0-.133.058-.318.282-.55.227-.237.592-.484 1.1-.708C4.899 1.795 6.354 1.5 8 1.5c1.647 0 3.102.295 4.117.742.51.224.874.47 1.101.707.224.233.282.418.282.551 0 .133-.058.318-.282.55-.227.237-.592.484-1.1.708C11.101 5.205 9.646 5.5 8 5.5c-1.647 0-3.102-.295-4.117-.742-.51-.224-.874-.47-1.101-.707-.224-.233-.282-.418-.282-.551zM1 3.5c0-.626.292-1.165.7-1.59.406-.422.956-.767 1.579-1.041C4.525.32 6.195 0 8 0c1.805 0 3.475.32 4.722.869.622.274 1.172.62 1.578 1.04.408.426.7.965.7 1.591v9c0 .626-.292 1.165-.7 1.59-.406.422-.956.767-1.579 1.041C11.476 15.68 9.806 16 8 16c-1.805 0-3.475-.32-4.721-.869-.623-.274-1.173-.62-1.579-1.04-.408-.426-.7-.965-.7-1.591v-9zM2.5 8V5.724c.241.15.503.286.779.407C4.525 6.68 6.195 7 8 7c1.805 0 3.475-.32 4.722-.869.275-.121.538-.257.778-.407V8c0 .133-.058.318-.282.55-.227.237-.592.484-1.1.708C11.101 9.705 9.646 10 8 10c-1.647 0-3.102-.295-4.117-.742-.51-.224-.874-.47-1.101-.707C2.558 8.318 2.5 8.133 2.5 8zm0 2.225V12.5c0 .133.058.318.282.55.227.237.592.484 1.1.708 1.016.447 2.471.742 4.118.742 1.647 0 3.102-.295 4.117-.742.51-.224.874-.47 1.101-.707.224-.233.282-.418.282-.551v-2.275c-.241.15-.503.285-.778.406-1.247.549-2.917.869-4.722.869-1.805 0-3.475-.32-4.721-.869a6.236 6.236 0 01-.779-.406z"></path>
                    </svg>
                </div>
                <h3>Quiz de connaissance</h3>
                <p>Testez votre compréhension du dépôt avec un quiz généré automatiquement</p>
            </div>
        </section>
    </main>

    <footer in:fade={{ delay: 1200, duration: 800 }}>
        <p> {new Date().getFullYear()} Note Mon Dépôt | Propulsé par l'IA</p>
    </footer>
</div>

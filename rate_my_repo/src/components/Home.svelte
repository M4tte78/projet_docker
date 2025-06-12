<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import "./Home.css";

  let repoUrl = "";
  let isLoading = false;
  let showError = false;
  let errorMessage = "";
  let clonedRepos = [];
  let analysisResult = "";

  async function handleSubmit() {
    if (!repoUrl) {
      showError = true;
      errorMessage = "Veuillez entrer une URL de dépôt GitHub";
      return;
    }

    const githubUrlPattern =
      /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    if (!githubUrlPattern.test(repoUrl)) {
      showError = true;
      errorMessage = "Veuillez entrer une URL valide de dépôt GitHub";
      return;
    }

    showError = false;
    isLoading = true;

    try {
      const response = await fetch("http://localhost:3000/repos/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: repoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors du clonage");
      }

      await response.json();
      await fetchClonedRepos();
    } catch (error) {
      console.error(error);
      showError = true;
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  }

  async function fetchClonedRepos() {
    try {
      const res = await fetch("http://localhost:3000/repos/getRepos");
      if (!res.ok) throw new Error("Impossible de récupérer les dépôts clonés");
      clonedRepos = await res.json();
    } catch (err) {
      console.error("Erreur:", err);
    }
  }

  async function handleAnalyze(repoName) {
    try {
      const res = await fetch("http://localhost:3000/groq/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName }),
      });
      if (!res.ok) throw new Error("Échec de l'analyse");
      const data = await res.json();
      analysisResult = data.result || "Aucune réponse.";
    } catch (err) {
      console.error(err);
      analysisResult = "Erreur lors de l'analyse.";
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:3000/repos/deleterepo/${id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Échec de la suppression");
      await fetchClonedRepos();
      analysisResult = "";
    } catch (err) {
      console.error(err);
    }
  }
  onMount(() => {
    fetchClonedRepos();
  });
</script>

<div class="page-wrapper">
  <div class="container">
    <header in:fly={{ y: -50, duration: 1000, easing: quintOut }}>
      <div class="logo">
        <svg viewBox="0 0 16 16" width="34" height="34" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
        <h1>Rate my repo</h1>
      </div>
    </header>

    <main>
      <section class="hero" in:fade={{ delay: 300, duration: 800 }}>
        <h2>Analyse de dépôt GitHub alimentée par l'IA</h2>
        <p>
          Obtenez des retours détaillés, une analyse des commits et une
          évaluation de qualité pour n'importe quel dépôt GitHub
        </p>
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
                Clone
              {/if}
            </button>
          </div>
          {#if showError}
            <p class="error-message" in:fade>{errorMessage}</p>
          {/if}
        </form>
      </section>

      {#if clonedRepos.length > 0}
        <section class="cloned-repos" in:fade={{ delay: 800, duration: 800 }}>
          <h3>Dépôts clonés récemment</h3>
          <div class="repo-cards">
            {#each clonedRepos as repo}
              <div class="repo-card">
                <p><strong>Nom :</strong> {repo.repo_name}</p>
                <p><strong>Propriétaire :</strong> {repo.owner}</p>
                <a href={repo.repo_url} target="_blank">Voir le dépôt</a>
                <div class="repo-actions">
                  <button
                    class="analyze-btn"
                    on:click={() => handleAnalyze(repo.repo_name)}
                    >Analyser</button
                  >
                  <button
                    class="delete-btn"
                    on:click={() => handleDelete(repo.id)}>Supprimer</button
                  >
                </div>
              </div>
            {/each}
          </div>
        </section>
      {/if}
    </main>

    <footer in:fade={{ delay: 1200, duration: 800 }}>
      <p>{new Date().getFullYear()} Rate my Repo</p>
    </footer>
  </div>

  <div class="floating-analysis">
    <div class="analysis-result">
      <h1>Résultat de l'analyse</h1>
      <p>
        {@html analysisResult ||
          "Cliquez sur 'Analyser' pour afficher le résultat ici."}
      </p>
    </div>
  </div>
</div>

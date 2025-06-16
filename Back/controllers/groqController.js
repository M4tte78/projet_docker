import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import fg from "fast-glob";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const __dirname = dirname(fileURLToPath(import.meta.url));

const lireFichier = (chemin) => {
  if (!fs.existsSync(chemin)) return null;
  if (fs.statSync(chemin).size > 20000) return "// [Fichier trop long tronqué]";
  return fs.readFileSync(chemin, "utf-8");
};

class GroqController {
  static async analyzeRepository(req, res) {
    const nomDepot = req.body.repoName;
    if (!nomDepot) return res.status(400).json({ error: "Nom du dépôt manquant." });

    const cheminDepot = path.join(__dirname, "..", "clonedRepositories", nomDepot);
    if (!fs.existsSync(cheminDepot)) {
      return res.status(404).json({ error: `Le dépôt "${nomDepot}" n'existe pas.` });
    }

    try {
      const dockerfiles = await fg(["**/Dockerfile"], { cwd: cheminDepot, dot: true });
      const fichiersTests = await fg(["**/*.test.js", "**/*.spec.js"], { cwd: cheminDepot, dot: true });
      const fichiersImportants = ["package.json", "README.md", ".github/workflows/ci.yml"];
      const tousFichiers = [...dockerfiles, ...fichiersTests, ...fichiersImportants];

      const resume = {
        hasDockerfile: dockerfiles.length > 0,
        dockerfiles,
        hasTests: fichiersTests.length > 0,
        testFiles: fichiersTests,
      };

      const fichiers = {};
      for (const fichier of tousFichiers) {
        const cheminComplet = path.join(cheminDepot, fichier);
        const contenu = lireFichier(cheminComplet);
        if (contenu) fichiers[fichier] = contenu;
      }

      const prompt = `
Réponds uniquement en HTML avec des balises <h1> pour les titres, <p class="ai-paragraph"> pour chaque paragraphe, et <ul><li> pour les listes. N'utilise pas Markdown.
Voici des infos sur le dépôt "${nomDepot}". Analyse : qualité, tests, CI/CD, conteneurisation. Donne une note pour chaque, une note totale, et dis si les tests sont bien faits ou non.

Résumé :
${JSON.stringify(resume, null, 2)}

Fichiers :
${Object.entries(fichiers).map(([nom, contenu]) => `--- ${nom} ---\n${contenu}`).join("\n\n")}
      `.trim();

      const reponse = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-70b-8192",
      });

      res.status(200).json({ result: reponse.choices[0].message.content });
    } catch (err) {
      console.error("Erreur Groq:", err);
      res.status(500).json({ error: "Échec de l’analyse", details: err.message });
    }
  }
}

export default GroqController;

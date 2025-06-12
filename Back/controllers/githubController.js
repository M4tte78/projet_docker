import { cloneRepo } from "../utils/cloneRepo.js";
import GitHubModel from "../models/githubModel.js";

class GithubController {
  static async cloneRepository(req, res) {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL manquante." });

    try {
      const result = await cloneRepo(url);
      const nomOwner = result.nomDuOwner;
      const nomProjet = result.nomProjet;
      await GitHubModel.saveRepoInfo(nomOwner, nomProjet, url);
      res.status(200).json({ message: "Dépôt cloné.", ...result });
    } catch (err) {
      res.status(500).json({ error: "Échec du clonage", details: err.message });
    }
  }
  static async getClonedRepositories(req, res) {
    try {
      const repos = await GitHubModel.getClonedRepositories();
      res.status(200).json(repos);
    } catch (err) {
      res.status(500).json({ error: "Échec de la récupération des dépôts clonés", details: err.message });
    }
  } 

  static async deleteRepository(req, res) {
    const { id } = req.params;
    try {
      const result = await GitHubModel.deleteRepoById(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Dépôt non trouvé." });
      }
      res.status(200).json({ message: "Dépôt supprimé avec succès." });
    } catch (err) {
      res.status(500).json({ error: "Échec de la suppression du dépôt", details: err.message });
    }
  }
}

export default GithubController;

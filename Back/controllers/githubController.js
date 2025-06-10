import { cloneRepo } from '../utils/cloneRepo.js';

class GithubController {
  static async cloneRepository(req, res) {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL manquante.' });

    try {
      const result = await cloneRepo(url);
      res.status(200).json({ message: 'Dépôt cloné.', ...result });
    } catch (err) {
      res.status(500).json({ error: 'Échec du clonage', details: err.message });
    }
  }
}

export default GithubController;

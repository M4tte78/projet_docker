import { connexion } from '../config/db.js';

class GitHubModel {
    static async saveRepoInfo(repoOwner, repoName, repoUrl) {
        const query = 'INSERT INTO repos (owner, repo_name, repo_url) VALUES (?, ?, ?)';
        await connexion.query(query, [repoOwner, repoName, repoUrl], (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion dans la base de données:', err);
                throw err;
            }
            return results;
        });
    }
}

export default GitHubModel;
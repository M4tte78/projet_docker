import { Router } from 'express';
import GithubController from '../controllers/githubController.js';

const router = Router();

router.post('/clone', GithubController.cloneRepository);
router.get('/getRepos', GithubController.getClonedRepositories);
router.post('/deleterepo/:id', GithubController.deleteRepository);

export default router;

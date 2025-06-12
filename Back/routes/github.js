import { Router } from 'express';
import GithubController from '../controllers/githubController.js';

const router = Router();

router.post('/clone', GithubController.cloneRepository);
router.get('/getRepos', GithubController.getClonedRepositories);

export default router;

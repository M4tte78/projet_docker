import { Router } from 'express';
import GithubController from '../controllers/githubController.js';

const router = Router();

router.post('/clone', GithubController.cloneRepository);

export default router;

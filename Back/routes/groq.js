import { Router } from 'express';
import GroqController from '../controllers/groqController.js';

const router = Router();

router.post('/analyze', GroqController.analyzeRepository);

export default router;


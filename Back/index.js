import express from 'express';
import cors from 'cors';
import githubRoutes from './routes/github.js';
import groqRoutes from './routes/groq.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json('Hello World!');
});
app.post('/manote' ,(req, res) => {
    const { note, nomDugars } = req.body;
    console.log(`Note: ${note}, Nom du Gars: ${nomDugars}`);
});

app.use('/repos', githubRoutes);
app.use('/groq', groqRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
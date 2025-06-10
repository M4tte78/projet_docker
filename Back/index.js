import express from 'express';
import cors from 'cors';
import githubRoutes from './routes/github.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json('Hello World!');
});

app.use('/github', githubRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
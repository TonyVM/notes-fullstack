import express from 'express';
import cors from 'cors';
import { notesRouter } from './routes/notesRouter';
// import dotenv from 'dotenv';
// dotenv.config();
const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use('/api/notes', notesRouter);

app.get('/', (req: express.Request, res: express.Response):void => {
  res.send('Hello World!!');
})
app.listen(3000, () => console.log('Server running on port 3000', 'http://localhost:3000'))
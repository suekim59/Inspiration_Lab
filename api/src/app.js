import express from 'express';
import cors from 'cors';
import listRouter from './routes/list';
import cardRouter from './routes/card';

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // routes
  app.use('/list', listRouter);
  app.use('/card', cardRouter);

  // default error handling
  // we will dig into this in the last session
  app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).json({ error: { message: error.message || 'Internal Server Error' } });
  });

  return app;
};

export default createApp;

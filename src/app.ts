import cors from 'cors';
import express, { Request, Response } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import hpp from 'hpp';
import modules from './modules';
// import apiRequestLogger from './middlewares/api-request-logger';
// import exceptionFilter from './middlewares/exception-filter';
// import modules from './modules';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(hpp());
app.use(cors());
// app.use(apiRequestLogger);

app.use(modules);

app.get('/', (_: Request, res: Response) => {
  res.send('pong');
});

app.use((_req, res, _next) => {
  if (!res.headersSent) {
    res.status(404).json({
      message: 'Resource does not exist',
    });
  }
  res.end();
});

// app.use(exceptionFilter);

export default app;

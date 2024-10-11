import { Router } from 'express';
import { jwtGuard } from '../middlewares/auth-guard';
import usersRoutes from './users';
import emailTempRoutes from './common/email-template'

const apiRouter = Router();
const route = Router();

const jwt = jwtGuard({ credentialsRequired: true }).unless({
  path: [
    '/',
    '/v1/users/signup',
    '/v1/users/signin'
  ]
});

apiRouter.use(usersRoutes);
apiRouter.use(emailTempRoutes);
route.use('/v1', jwt, apiRouter);

export default route;

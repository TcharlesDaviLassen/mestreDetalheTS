import cors from 'cors';
import express, { } from 'express';

import routerCitie from './cities';
import routerState from './states';
import routerUsers from './users';

const router = express.Router();

router.use(cors());

router.use(routerCitie);
router.use(routerState);
router.use(routerUsers);

export default router;

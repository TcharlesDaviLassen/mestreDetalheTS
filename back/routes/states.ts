import { Router, Request, Response, NextFunction } from 'express';
const routerState = Router();

import StateModel from'../models/State';
import StatesController from'../controllers/StatesController';

const validateStatesId = async (req: Request, res: Response, next: NextFunction) => {
  const state = await StateModel.findByPk(req.params.StatesId);
  if (!state) {
    return res.status(404).json({ error: 'States not found' });
  }
  next();
}

routerState.get('/states', StatesController.index);

routerState.post('/states', StatesController.create);

routerState.get('/states/:StatesId', validateStatesId, StatesController.show);

routerState.put('/states/:StatesId', validateStatesId, StatesController.update);

routerState.delete('/states/:StatesId', validateStatesId, StatesController.delete);

export default routerState;
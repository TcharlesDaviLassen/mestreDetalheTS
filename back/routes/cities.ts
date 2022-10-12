import { Router, Request, Response, NextFunction } from 'express';
const routerCitie = Router();

import CitiesModel from'../models/Cities';
import CitiesController from'../controllers/CitiesController';

const validateCitiesId = async (req: Request, res: Response, next: NextFunction ) => {
  const cities = await CitiesModel.findByPk(req.params.CitiesId);
  if (!cities) {
    return res.status(404).json({ error: 'Cities not found' });
  }
  next();
}

routerCitie.get('/cities', CitiesController.index);

routerCitie.post('/cities', CitiesController.create);

routerCitie.get('/cities/:CitiesId', validateCitiesId, CitiesController.show);

routerCitie.put('/cities/:CitiesId', validateCitiesId, CitiesController.update);

routerCitie.delete('/cities/:CitiesId', validateCitiesId, CitiesController.delete);

export default routerCitie;
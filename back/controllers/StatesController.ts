import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import StateModel from '../models/State';

import LogsController from '../models/Logs';

class StateController {

  index = async (req: Request, res: Response, next: NextFunction) => {

    // const params = req.query;
    // const limit: number = params.limit ? parseInt(params.limit as string) : 100;
    // const page: number = params.page ? parseInt(params.page as string) : 1;
    // const offset: number = (page - 1) * limit;
    // const sort: string = params.sort ? params.sort as string : 'id';
    // const order: string = params.order ? params.order as string : 'ASC';
    // const where: any = {};

    //ou também
    const params = req.query;
    const limit: number = parseInt(params.limit as string) || 100;
    const page: number = parseInt(params.page as string) || 1;
    const offset: number = (page - 1) * limit;
    const sort: string = params.sort as string || 'id';
    const order: string = params.order as string || 'ASC';
    const where: any = {};

    if (params.name) {
      where.name = {
        [Op.iLike]: `%${params.name}%`
      };
    }

    const login = await StateModel.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [[sort, order]]
    });
    res.json(login);

  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._validateData(req.body);
      const state = await StateModel.create(data);
      res.json(state);
      await LogsController.create({ action: "PUBLISHER ADD", method: req.method });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.params)
    const state = await StateModel.findByPk(req.params.StatesId);
    res.json(state);
    console.log(state)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: any = req.params.StatesId;
      const data = await this._validateData(req.body, id);
      await StateModel.update(data, {
        where: {
          id: id
        }
      });
      await LogsController.create({ action: "PUBLISHER UPDATE", method: req.method });
      res.json(await StateModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    await StateModel.destroy({
      where: {
        id: req.params.StatesId
      }
    });
    await LogsController.create({ action: "PUBLISHER DELETE", method: req.method });
    res.json({});
  }

  _validateData = async (data: string, id?: number) => {
    const attributes = ['name', 'province'];
    const state: any = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      state[attribute] = data[attribute];
    }

    if (await this._checkIfEmailExists(state.name, id)) {
      throw new Error(`The States address "${state.name}" already exists.`);
    }

    return state;
  }

  _checkIfEmailExists = async (name: string, id?: number) => {
    const where: any = {
      name: name
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await StateModel.count({
      where: where
    });

    return count > 0;
  }

}

export default new StateController();

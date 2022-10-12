import LogModel from '../models/Logs';
import { NextFunction, Request, Response } from 'express';

class LogsController {

  index = async (req: Request, res: Response ) => {
    const logs = await LogModel.findAll({});
    res.json(logs);
  }

  create = async (req: any, res: Response) => {
    try {
      await LogModel.create(req);
    } catch (error) {
      res.status(400).json({ error: error.message });
      // res.json({error : error.message})
    }
  }

  _validateData = async (data: string, id: number) => {
    const attributes = ['action', 'method'];
    const log = {};
    for (const attribute of attributes) {
      log[attribute] = data[attribute];
    }
    return log;
  }

}

export default new LogsController();
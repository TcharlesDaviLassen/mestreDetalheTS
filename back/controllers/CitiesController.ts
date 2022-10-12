import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';

import CityModel from '../models/Cities.js';
import StateModel from '../models/State.js';

import LogsController from '../models/Logs';

class CitiesController {

  index = async (req: Request, res: Response, next: NextFunction) => {

    const params: any = req.query;
    const limit: number = parseInt(params.limit + "") || 10;
    const page: number = parseInt(params.page + "") || 1;
    const offset: number = (page - 1) * limit;
    let sort: any = params.sort || 'id'; // Usar any quando não se sabe o valor que esta vindo
    let order: any = params.order || 'ASC';
    const where: any = {};


    if (params.name) {
      where.name = {
        [Op.iLike]: `%${params.name}%`
      }
    }

    if (sort == 'Cities') {
      sort = { model: CityModel };
      order = 'name';
    }

    try {
      const cities = await CityModel.findAll({

        include: [{
          model: StateModel,
          required: false,
          attributes: ['name', 'province']
        }],
        where: where,
        limit: limit,
        offset: offset,
        order: [[sort, order]]
      });

      res.json(cities);


    } catch (error) {
      console.log(`Erro de ${error}`)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req.body)
      const data = await this._validateData(req.body);
      const cities = await CityModel.create(data);
      // const loggs = await LogsModel.create()
      // res.json(loggs);
      await LogsController.create({ action: "CITIES ADD", method: req.method });
      res.json(cities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body)
    const cities = await CityModel.findByPk(req.params.CitiesId);
    res.json(cities);
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      const id = req.params.CitiesId;
      // console.log(id)
      const data = await this._validateData(req.body, id);
      // console.log(data)
      await CityModel.update(data, {
        where: {
          id: id
        }
      });
      await LogsController.create({ action: "CITIES UPDATE", method: req.method });
      res.json(await CityModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    await CityModel.destroy({
      where: {
        id: req.params.CitiesId
      }
    });
    await LogsController.create({ action: "CITIES DELETE", method: req.method });
    res.json({});
  }

  _validateData = async (data: any, id?: any) => {
    const attributes = ['name', 'cep', 'StateId'];
    const cities: any = {};

    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      cities[attribute] = data[attribute];
    }

    //Se o CEP já existe acusa erro
    if (await this._checkIfEmailExists(cities.cep, id)) {
      throw new Error(`The citie "${cities.cep}" already exists.`);
    }


    if (await this._checkIfCityAndStateExists(cities.name, cities.StateId)) {
      throw new Error(`The city in the State "${cities.StateId}" already exists.`);
    }

    return cities;
  }

  _checkIfCityAndStateExists = async (name: string, state: string) => {
    const cities = await CityModel.count(
      {
        where:
        {
          [Op.and]: [
            { StateId: state },
            { name: name }
          ]
        }
      });

    return cities > 0;
  }

  _checkIfEmailExists = async (cep: string, id: number) => {
    const where: any = {
      cep: cep
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await CityModel.count({
      where: where
    });

    return count > 0;
  }

}

export default new CitiesController();

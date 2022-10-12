import { Op } from 'sequelize';
import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/User.js';
import LogsController from '../models/Logs';

import nodemailer from 'nodemailer';

import { Md5 } from 'ts-md5';
let md5: any = new Md5();

class UsersController {

  index = async (req: Request, res: Response , next:NextFunction) => {

    const params = req.query;
    const limit: number = params.page ? parseInt(params.limit as string) : 100;
    const page: number = params.page ? parseInt(params.page as string) : 1;
    const offset = (page - 1) * limit;
    const sort: string = params.sort ? params.sort as string : 'id';
    const order: string = params.order  ? params.order as string : 'ASC';
    const where: any = {};

    if (params.name) {
      where.name = {
        [Op.iLike]: `%${params.name}%`
      }
    }

    if (params.email) {
      where.email = {
        [Op.iLike]: `%${params.email}%`
      };
    }

    const users = await UserModel.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [[sort, order]]
    });
    res.json(users);


    // if (params.min_age) {
    //   where.age = {
    //     [Op.gte]: params.min_age
    //   };
    // }

    // if (params.max_age) {
    //   if (! where.age) {
    //     where.age = {};
    //   }
    //   where.age[Op.lte] = params.max_age;
    // }

    // if (params.sex) {
    //   where.sex = params.sex;
    // }

  }

  create = async (req: Request, res: Response , next:NextFunction) => {
    try {

      req.body.password = (md5(req.body.password))
      this._main(req.body.email);
      const data = await this._validateData(req.body);
      const user = await UserModel.create(data);
      res.json(user);
      await LogsController.create({ action: "USER ADD", method: req.method });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req: Request, res: Response , next:NextFunction) => {
    const user = await UserModel.findByPk(req.params.userId);
    res.json(user);
  }

  update = async (req: Request, res: Response , next:NextFunction) => {
    try {
      req.body.password = (md5(req.body.password))
      const id = req.params.userId;
      const data = await this._validateData(req.body, id);
      await UserModel.update(data, {
        where: {
          id: id
        }
      });
      res.json(await UserModel.findByPk(id));
      await LogsController.create({ action: "USER UPDATE", date: req.method });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req: Request, res: Response , next:NextFunction) => {
    await UserModel.destroy({
      where: {
        id: req.params.userId
      }
    });
    res.json({});
    await LogsController.create({ action: "USER DELETE", method: req.method });
  }

  _validateData = async (data: number, id?: any) => {
    // 
    const attributes = ['name', 'age', 'sex', 'email', 'password'];
    const user: any = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      user[attribute] = data[attribute];
    }

    if (await this._checkIfEmailExists(user.email, id)) {
      throw new Error(`The user with mail address "${user.email}" already exists.`);

    }

    if (await this._checkIfNameExists(user.name, id)) {
      throw new Error(`The user with mail address "${user.name}" already exists.`);

    }

    return user;
  }

  _main = async (email: any) => {

    let email_user = 'tcharles.lassen@universo.univates.br';
    let email_pass = "TcharlesDavi1896";
    let email_to = await email;
    console.log(email_to);
    let email_subject = "Bem vindo a Biblio";
    let email_content = "Teste email content a biblioteca";
    let email_html = '<h1>Faalaaa Dev</h1><p>Muito bom ter voçê por aqui </P>';
    // <img src="cid:igne_lab_rockedseat"/>
    // attachments: [{
    //   filename: 'igne_lab_rockedseat.png',
    //   path: __dirname+'/igne_lab_rockedseat.png',
    //   cid: 'igne_lab_rockedseat.png' //same cid value as in the html img src
    // }],

    var transponder = nodemailer.createTransport(
      {
        service: "gmail",
        auth: {
          user: email_user,
          pass: email_pass
        }
      }
    )

    var mailOptions = {
      from: email_user,
      to: await email,
      subject: email_subject,
      text: email_content,
      html: email_html,
    };

    transponder.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Erro ao enviar o email " + error)
      }
      else {
        console.log("Email enviado " + info.response)
      }
    })
  }

  _checkIfEmailExists = async (email: string, id?: number) => {
    const where: any = {
      email: email
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await UserModel.count({
      where: where
    });

    return count > 0;
  }

  _checkIfNameExists = async (name: string, id?: number) => {
    const where: any= {
      name: name
    };
    console.log(where.id)

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await UserModel.count({
      where: where

    });
    return count > 0;
  }


}


export default new UsersController();





// import { Sequelize, Op } from 'sequelize';
// import express, { Express, Request, Response } from 'express';
// import UserModel from '../models/User';

// class UsersController {

//   index = async (req: Request, res: Response) => {
//     const params = req.query;
//     const limit: number = parseInt(params.limit as string) || 100;
//     const page: number = parseInt(params.page as string) || 1;
//     const offset: number = (page - 1) * limit;
//     const sort: any = params.sort || 'id';
//     const order: any = params.order || 'ASC';
//     const where: any = {};

//     if (params.name) {
//       where.name =
//       {
//         [Op.iLike]: `%${params.name}%`
//       };
//     }

//     if (params.email) {
//       where.email =
//       {
//         [Op.iLike]: `%${params.email}%`
//       };
//     }

//     if (params.min_age) {
//       where.age =
//       {
//         [Op.gte]: params.min_age
//       };
//     }

//     if (params.max_age) {
//       if (!where.age) {
//         where.age = {};
//       }

//       where.age[Op.lte] = params.max_age;
//     }

//     if (params.sex) {
//       where.sex = params.sex;
//     }

//     const users = await UserModel.findAll({
//       where: where,
//       limit: limit,
//       offset: offset,
//       order: [[sort, order]]
//     });
//     res.json(users);
//   }

//   create = async (req: Request, res: Response, next: any) => {
//     try {
//       const data = await this._validateData(req.body, null);
//       const user = await UserModel.create(data);
//       res.json(user);
//     }
//     catch (error: any) {
//       res.status(400).json({ error: error.message + "" });
//     }
//   }

//   show = async (req: Request, res: Response, next: any) => {
//     const user = await UserModel.findByPk(req.params.userId);
//     res.json(user);
//   }

//   update = async (req: Request, res: Response, next: any) => {
//     try {
//       const id = req.params.userId;
//       const data = await this._validateData(req.body, id);
//       await UserModel.update(data, {
//         where: {
//           id: id
//         }
//       });
//       res.json(await UserModel.findByPk(id));
//     }
//     catch (error: any) {
//       res.status(400).json({ error: error.message + "" });
//     }
//   }

//   delete = async (req: Request, res: Response, next: any) => {
//     await UserModel.destroy({
//       where: {
//         id: req.params.userId
//       }
//     });
//     res.json({});
//   }

//   _validateData = async (data: any, id: any) => {
//     const attributes = ['name', 'age', 'sex', 'email'];
//     const user: any = {};

//     for (const attribute of attributes) {
//       if (!data[attribute]) {
//         throw new Error(`The attribute "${attribute}" is required.`);
//       }

//       user[attribute] = data[attribute];
//     }

//     if (await this._checkIfEmailExists(user.email, id)) {
//       throw new Error(`The user with mail address "${user.email}" already exists.`);
//     }

//     return user;
//   }

//   _checkIfEmailExists = async (email: string, id: string) => {
//     const where: any =
//     {
//       email: email
//     };

//     if (id) {
//       where.id = { [Op.ne]: id }; // WHERE id != id
//     }

//     const count = await UserModel.count({
//       where: where
//     });

//     return count > 0;
//   }

// }

// const usersController = new UsersController();
// export default usersController;

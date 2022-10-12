import { DataTypes, Model } from'sequelize';

import db from'../db/index';

class States extends Model { 
    declare id: number;
    declare name: string;
    declare province: string;
};

States.init(
    {
        id:
        {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        province:
        {
            type: DataTypes.CHAR,
            allowNull: false,
        }

    },
    {
        sequelize: db,
        tableName: 'states',
        modelName: 'States',
    }
);


export default States;
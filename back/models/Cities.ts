import { CharDataType, DataTypes, Model } from 'sequelize';

import db from '../db/index';

import State from './State';

class Cities extends Model {
    declare id: number;
    declare name: string;
    declare cep: CharDataType;
    declare StateId: number;
}

Cities.init(
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
        cep: {
            type: DataTypes.CHAR(9),
            allowNull: true,
            // defaultValue: '0000-0000'
        }
        // state_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: State,
        //         key: 'id'
        //     }
        // }

    },
    {
        sequelize: db,
        tableName: 'cities',
        modelName: 'Cities',
    }
);

State.hasMany(Cities);
Cities.belongsTo(State);

export default Cities;
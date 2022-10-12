import { DataTypes, Model } from 'sequelize';
import db from '../db/index';

class Logs extends Model {

    declare id: number;
    declare action: string;
    declare method: string;
    
};

Logs.init(
    {
        id:
        {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        action:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        method:
        {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize: db,
        modelName: "Logs",
        tableName: "logs",

    },

);

export default Logs;

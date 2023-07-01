import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes
} from 'sequelize';
import { sequelize } from '..';

class EventLog extends Model<
  InferAttributes<EventLog>,
  InferCreationAttributes<EventLog>
> {
  declare id: CreationOptional<number>;
  declare blockHash: string;
  declare blockNumber: number;
  declare transactionHash: string;
  declare transactionIndex: number;
  declare cell_x: number;
  declare cell_y: number;
  declare hexValue: string;
  declare createdAt: CreationOptional<Date>;
}

EventLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    blockHash: {
      type: new DataTypes.STRING(64),
      allowNull: false,
      unique: false,
      validate: {
        is: /^[a-fA-F0-9]{64,64}$/
      }
    },
    blockNumber: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: false
    },
    transactionHash: {
      type: new DataTypes.STRING(64),
      allowNull: false,
      unique: false,
      validate: {
        is: /^[a-fA-F0-9]{64,64}$/
      }
    },
    transactionIndex: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: false
    },
    cell_x: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: false
    },
    cell_y: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: false
    },
    hexValue: {
      type: new DataTypes.STRING(8),
      allowNull: false,
      unique: false,
      validate: {
        is: /^[a-fA-F0-9]{8,8}$/
      }
    },
    createdAt: DataTypes.DATE
  },
  {
    tableName: 'events_log',
    sequelize: sequelize
  }
);

export { EventLog };

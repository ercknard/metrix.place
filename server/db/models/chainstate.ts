import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes
} from 'sequelize';
import { sequelize } from '..';

class ChainState extends Model<
  InferAttributes<ChainState>,
  InferCreationAttributes<ChainState>
> {
  declare id: CreationOptional<number>;
  declare blockHash: string;
  declare blockNumber: number;
  declare blockNumberLastLog: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ChainState.init(
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
      unique: false,
      defaultValue: 0
    },
    blockNumberLastLog: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: false,
      defaultValue: 0
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: 'chainstate',
    sequelize: sequelize
  }
);

export { ChainState };

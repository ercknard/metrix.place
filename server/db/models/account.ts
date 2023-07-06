import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes
} from 'sequelize';
import { sequelize } from '..';

class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  declare id: CreationOptional<number>;
  declare isAdmin: boolean;
  declare mrx: string | null;
  declare nonce: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    isAdmin: DataTypes.BOOLEAN,
    mrx: {
      type: new DataTypes.STRING(40),
      allowNull: true,
      unique: true,
      validate: {
        is: /^[a-fA-F0-9]{40,40}$/
      }
    },
    nonce: {
      type: new DataTypes.STRING(256),
      allowNull: true,
      unique: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: 'accounts',
    sequelize: sequelize
  }
);

export { Account };

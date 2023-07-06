import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes
} from 'sequelize';
import { sequelize } from '..';

class PixelMap extends Model<
  InferAttributes<PixelMap>,
  InferCreationAttributes<PixelMap>
> {
  declare id: CreationOptional<number>;
  declare cell_x: number;
  declare cell_y: number;
  declare hexValue: string | null;
}

PixelMap.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
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
      allowNull: true,
      unique: false,
      validate: {
        is: /^[a-fA-F0-9]{8,8}$/
      }
    }
  },
  {
    tableName: 'pixel_map',
    sequelize: sequelize
  }
);

export { PixelMap };

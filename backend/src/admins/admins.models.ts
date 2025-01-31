import { Table, Column, Model, DataType } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Table
export class Admin extends Model {
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: RegExp(/^[a-zA-Z0-9_-]+$/),
      len: [4, 20],
    },
    set(val: string) {
      this.setDataValue('username', val.toLowerCase());
    },
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
    set(val: string): void {
      this.setDataValue('email', val.toLowerCase());
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(value: string): void {
      // Hash the password before saving it
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(value, salt);
      this.setDataValue('password', hashedPassword);
    },
  })
  password: string;

  @Column({
    type: DataType.ENUM('super-admin', 'admin'),
    allowNull: false,
    defaultValue: 'admin',
  })
  role: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(val: string) {
      const newValue = val.charAt(0).toUpperCase() + val.slice(1);
      this.setDataValue('first_name', newValue);
    },
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    set(val: string) {
      if (!val) {
        this.setDataValue('last_name', null);
      } else {
        const newValue = val.charAt(0).toUpperCase() + val.slice(1);
        this.setDataValue('last_name', newValue);
      }
    },
  })
  last_name: string;
}

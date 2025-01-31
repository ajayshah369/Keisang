import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Vehicle extends Model {
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
    set(val: string): void {
      this.setDataValue('title', val.titleCase());
    },
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    set(val: string): void {
      this.setDataValue('description', val.titleCase());
    },
  })
  description: string;

  @Column({
    type: DataType.ENUM('new', 'used', 'cpo'),
    allowNull: false,
  })
  condition: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(val: string): void {
      this.setDataValue('brand', val.toLowerCase());
    },
  })
  brand: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(val: string): void {
      this.setDataValue('product_type', val.toLowerCase());
    },
  })
  product_type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  custom_label: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  price: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'dealer 1',
    set(val: string): void {
      this.setDataValue('dealer', val.toLowerCase());
    },
  })
  dealer: string;

  @Column({
    type: DataType.DATE(6),
    allowNull: false,
    defaultValue: new Date().toISOString(),
  })
  timestamp: string;
}

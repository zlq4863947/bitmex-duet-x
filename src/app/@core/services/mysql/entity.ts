import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryColumn() orderId: string;

  @Column() symbol: string;

  @Column('float') price: number;

  @Column('float') amount: number;

  @Column() side: string;

  @Column() status: string;

  @Column() time: string;

  constructor(obj?: Order) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn() id!: number;

  @Column('bigint') time: number;

  @Column() symbol: string;

  @Column() resolution: string;

  @Column() content: string;

  @Column() operation: string;

  constructor(obj?: Log) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}

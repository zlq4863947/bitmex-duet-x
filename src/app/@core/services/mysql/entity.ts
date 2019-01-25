import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order')
export class OrderEntity {
  @PrimaryColumn() orderId: string;

  @Column() symbol: string;

  @Column('float') price: number;

  @Column('float') amount: number;

  @Column() side: string;

  @Column() status: string;

  @Column() time: string;

  constructor(obj?: OrderEntity) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}

@Entity('log')
export class LogEntity {
  @PrimaryGeneratedColumn() id!: number;

  @Column() time: string;

  @Column() symbol: string;

  @Column() resolution: string;

  @Column() operation: string;

  @Column({ length: 300, nullable: true }) content: string;

  @Column({ length: 3000, nullable: true }) memo: string;

  constructor(obj?: LogEntity) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}

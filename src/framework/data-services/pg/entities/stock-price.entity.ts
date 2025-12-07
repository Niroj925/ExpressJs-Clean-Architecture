import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

@Entity('stock_price') 
export class StockPriceEntity extends BaseEntity{

  @Column({ name: 'symbol', length: 50 })
  symbol: string;

  @Column({ name: 'ltp', type: 'float' })
  ltp: number;

  @Column({ name: 'ltv', type: 'float' })
  ltv: number;

  @Column({ name: 'point_change', type: 'float', nullable: true })
  pointChange: number;

  @Column({ name: 'percentage_change', type: 'float', nullable: true })
  percentageChange: number;

  @Column({ name: 'open', type: 'float' })
  open: number;

  @Column({ name: 'high', type: 'float' })
  high: number;

  @Column({ name: 'low', type: 'float' })
  low: number;

  @Column({ name: 'volume', type: 'float' })
  volume: number;

  @Column({ name: 'date', type: 'date' })
  date: Date;

}

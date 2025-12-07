import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base/base.entity";

@Entity({ name: "stock_info" })
export class StockInfoEntity extends BaseEntity{

  @Column({ name: "symbol",unique:true })
  symbol: string;

  @Column({ name: "stock_listed_shares", type: "decimal" })
  stockListedShares: number;

  @Column({ name: "paid_up_capital", type: "decimal" })
  paidUpCapital: number;

  @Column({ name: "issued_capital", type: "decimal" })
  issuedCapital: number;

  @Column({ name: "public_shares", type: "decimal" })
  publicShares: number;

  @Column({ name: "public_percentage", type: "decimal" })
  publicPercentage: number;

  @Column({ name: "promoter_shares", type: "decimal" })
  promoterShares: number;

  @Column({ name: "promoter_percentage", type: "decimal" })
  promoterPercentage: number;

  @Column({ name: "market_capitalization", type: "decimal" })
  marketCapitalization: number;

  @Column({ name: "updated_date", type: "timestamp" })
  updatedDate: Date;

  @Column({ name: "sub_index",nullable:true })
  subIndex: string;

  @Column({ name: "full_name",nullable:true })
  fullName: string;

  @Column({ name: "latest_transaction_price", type: "decimal" })
  latestTransactionPrice: number;

  @Column({ name: "point_change", type: "decimal" ,nullable:true})
  pointChange: number;

  @Column({ name: "percentage_change", type: "decimal",nullable:true })
  percentageChange: number;

  @Column({ name: "volume", type:'bigint' ,nullable:true})
  volume: number;
}

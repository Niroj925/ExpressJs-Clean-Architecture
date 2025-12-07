import { Entity, Column, OneToOne } from "typeorm";
import { BaseEntity } from "./base/base.entity";
import { AuthEntity } from "./auth.entity";

@Entity('user')
export class UserEntity extends BaseEntity{
  @Column({name:'name', length: 100 })
  name: string;

  @Column({name:'is_active', default: true })
  isActive: boolean;

  @OneToOne(()=>AuthEntity,auth=>auth.user)
  auth:AuthEntity;
}

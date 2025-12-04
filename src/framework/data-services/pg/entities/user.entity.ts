import { Entity, Column, OneToOne } from "typeorm";
import { BaseEntity } from "./base/base.entity";
import { AuthEntity } from "./auth.entity";

@Entity('user')
export class UserEntity extends BaseEntity{
  @Column({ length: 100 })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(()=>AuthEntity,auth=>auth.user)
  auth:AuthEntity;
}

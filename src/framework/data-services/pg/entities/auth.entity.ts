import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base/base.entity";
import { UserEntity } from "./user.entity";

@Entity('auth')
export class AuthEntity extends BaseEntity{
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(()=>UserEntity,(user)=>user.auth)
  @JoinColumn({name:'userId'})
  user:UserEntity;
}

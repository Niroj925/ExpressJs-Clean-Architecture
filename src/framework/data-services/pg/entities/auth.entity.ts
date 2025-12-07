import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base/base.entity";
import { UserEntity } from "./user.entity";

@Entity("auth")
export class AuthEntity extends BaseEntity {
  @Column({name:'email', unique: true })
  email: string;

  @Column({name:'password'})
  password: string;

  @Column({name:'refresh_token', nullable: true })
  refreshToken: string;

  @OneToOne(() => UserEntity, (user) => user.auth, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: UserEntity;
}

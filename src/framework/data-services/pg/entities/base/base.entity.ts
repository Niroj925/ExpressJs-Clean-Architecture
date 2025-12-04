import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  public createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  public updatedAt?: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    default: null,
    nullable: true,
    select: false,
    name: 'deleted_at',
  })
  public deletedAt?: Date;


  toResponse(exclude: string[] = ['updatedAt', 'deletedAt']) {
  const self = this as any;

  Object.keys(self).forEach((key) => {
    if (exclude.includes(key)) {
      delete self[key];
    }
  });

  return self;
}


  static get REPOSITORY(): string {
    const name = this.name
      .replace(/([A-Z])/g, ' $1')
      .replace(/entity/gi, '')
      .trim()
      .split(' ')
      .join('_')
      .toUpperCase();
    return `${name}_REPOSITORY`;
  }
}

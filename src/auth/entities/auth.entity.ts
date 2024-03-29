import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/post/entities/post.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text')
  fullName: string;

  @ApiProperty()
  @Column('integer')
  age: number;

  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @Column({ default: false })
  isConfirmed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post;

  @BeforeInsert()
  checkInsert() {
    this.email = this.email.toLowerCase();
  }

  @BeforeUpdate()
  checkUpdate() {
    this.checkInsert();
  }
}

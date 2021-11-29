import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as argon2 from 'argon2';

@Entity('user')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @Column({ default: '' })
  imageLink: string;
}

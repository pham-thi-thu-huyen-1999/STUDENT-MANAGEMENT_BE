import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as crypto from 'crypto';
import RoleEntity from './role.entity';
import type { IUserEntity } from 'src/interfaces/user.interface';
import MenuUserEntity from './menuUser';
import ArticleEntity from './article.entity';

@Entity({ name: 'user' })
class UserEntity {
  constructor(data?: IUserEntity) {
    if (data) {
      const { id, avatar, email, firstName, lastName, password, created, updated } = data;
      this.id = id;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.avatar = avatar;
      this.password = password;
      this.created = created;
      this.updated = updated;
    }
  }
  private showPassword: boolean;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ name: 'first_name', default: '' })
  firstName: string;

  @Column({ name: 'last_name', default: '' })
  lastName: string;

  @Column({ default: '' })
  avatar: string;

  @Column()
  @MinLength(6)
  @MaxLength(15)
  @IsNotEmpty()
  password: string;

  @Column({ type: 'double', default: Date.now() })
  created: number;

  @Column({ type: 'double', default: Date.now() })
  updated: number;

  // @BeforeUpdate()
  // updateTimestamp() {
  //   this.updated = Date.now();
  // }

  @ManyToMany(() => RoleEntity, (role) => role.users, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[];

  @ManyToOne(() => MenuUserEntity, (userMenuUser) => userMenuUser.users)
  @JoinTable({
    name: 'user_menu_user',
    joinColumn: {
      name: 'menu_user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  menuUser: MenuUserEntity;

  @OneToMany(() => ArticleEntity, (article) => article.user, { cascade: true })
  articles: ArticleEntity[];

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }
}

export default UserEntity;

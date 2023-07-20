import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import MenuUserEntity from './menuUser';
import UserEntity from './user.entity';

@Entity({ name: 'user_menu_user' })
class UserMenuUserEntity {
  constructor() {}

  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'menu_user_id' })
  menuUserId: number;

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;

  @ManyToOne(() => MenuUserEntity, (menuData) => menuData.id, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'menu_user_id', referencedColumnName: 'id' }])
  menuUser: MenuUserEntity[];
}

export default UserMenuUserEntity;

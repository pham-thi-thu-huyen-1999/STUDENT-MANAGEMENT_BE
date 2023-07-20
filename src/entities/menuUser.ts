import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import MenuResourceEntity from './menuResource.entity';
import UserEntity from './user.entity';

interface MenuUserType {
  id: number;
  name: string;
  menuResources: MenuResourceEntity[];
}

@Entity({ name: 'menu_user' })
class MenuUserEntity {
  constructor(data?: MenuUserType) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.menuResources = data.menuResources;
    }
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @ManyToOne(() => MenuResourceEntity, (menuResource) => menuResource.menuUsers, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'menu_user_menu_resource',
    joinColumn: {
      name: 'menu_user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'menu_resource_id',
      referencedColumnName: 'id',
    },
  })
  menuResources: MenuResourceEntity[];

  @OneToMany(() => UserEntity, (userMenuUser) => userMenuUser.menuUser, { cascade: true })
  users: UserEntity[];
}

export default MenuUserEntity;

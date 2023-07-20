import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import MenuUserEntity from './menuUser';
import MenuResourceEntity from './menuResource.entity';

@Entity({ name: 'menu_user_menu_resource' })
class MenuUserMenuResourceEntity {
  constructor() {}

  @PrimaryColumn({ name: 'menu_user_id' })
  menuUserId: number;

  @PrimaryColumn({ name: 'menu_resource_id' })
  menuResourceId: number;

  @ManyToOne(() => MenuUserEntity, (menuData) => menuData.menuResources, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'menu_user_id', referencedColumnName: 'id' }])
  menuUsers: MenuUserEntity[];

  @ManyToOne(() => MenuResourceEntity, (menuResource) => menuResource.menuUsers, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'menu_resource_id', referencedColumnName: 'id' }])
  menuResources: MenuResourceEntity[];
}

export default MenuUserMenuResourceEntity;

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import MenuUserEntity from './menuUser';

interface MenuResourceType {
  id: number;
  name: string;
  iconType: string;
  iconName: string;
}

@Entity({ name: 'menu_resource' })
class MenuResourceEntity {
  constructor(data?: MenuResourceType) {
    if (data) {
      const { id, name, iconName, iconType } = data;
      this.id = id;
      this.name = name;
      this.iconName = iconName;
      this.iconType = iconType;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'icon_type' })
  iconType: string;

  @Column({ name: 'icon_name' })
  iconName: string;

  @Column({ name: 'path' })
  path: string;

  @ManyToMany(() => MenuUserEntity, (menuList) => menuList.menuResources, {
    cascade: true,
  })
  menuUsers: MenuUserEntity[];
}

export default MenuResourceEntity;

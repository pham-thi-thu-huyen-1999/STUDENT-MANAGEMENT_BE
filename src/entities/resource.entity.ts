import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import PermissionEntity from './permission.entity';

interface ResourceType {
  id: number;
  name: string;
  value: string;
  permissions: PermissionEntity[];
}

@Entity({ name: 'resource' })
class ResourceEntity {
  constructor(data?: ResourceType) {
    if (data) {
      const { id, name, value, permissions } = data;
      this.id = id;
      this.name = name;
      this.value = value;
      this.permissions = permissions;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  @IsNotEmpty()
  name: string;

  @Column({ name: 'value' })
  @IsNotEmpty()
  value: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.resources, {
    cascade: true,
  })
  permissions: PermissionEntity[];
}

export default ResourceEntity;

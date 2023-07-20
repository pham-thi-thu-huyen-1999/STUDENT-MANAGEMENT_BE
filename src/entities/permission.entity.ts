import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import ResourceEntity from './resource.entity';
import RoleEntity from './role.entity';

interface PermissionType {
  id: number;
  name: string;
  resources: ResourceEntity[];
  roles: RoleEntity[];
}

@Entity({ name: 'permission' })
class PermissionEntity {
  constructor(data?: PermissionType) {
    if (data) {
      const { id, name, resources, roles } = data;
      this.id = id;
      this.name = name;
      this.resources = resources;
      this.roles = roles;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @ManyToMany(() => ResourceEntity, (resource) => resource.permissions, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'permission_resource',
    joinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'resource_id',
      referencedColumnName: 'id',
    },
  })
  resources: ResourceEntity[];

  @ManyToMany(() => RoleEntity, (role) => role.permissions, { cascade: true })
  roles: RoleEntity[];
}

export default PermissionEntity;

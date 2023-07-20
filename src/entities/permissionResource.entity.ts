import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import PermissionEntity from './permission.entity';
import ResourceEntity from './resource.entity';

@Entity({ name: 'permission_resource' })
class PermissionResourceEntity {
  @PrimaryColumn({ name: 'permission_id' })
  permissionId: number;

  @PrimaryColumn({ name: 'resource_id' })
  resourceId: number;

  @ManyToOne(() => PermissionEntity, (permission) => permission.resources, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'permission_id', referencedColumnName: 'id' }])
  permissions: PermissionEntity[];

  @ManyToOne(() => ResourceEntity, (resource) => resource.permissions, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'resource_id', referencedColumnName: 'id' }])
  resources: ResourceEntity[];
}

export default PermissionResourceEntity;

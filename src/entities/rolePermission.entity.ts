import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import PermissionEntity from './permission.entity';
import RoleEntity from './role.entity';

@Entity('role_permission')
class RolePermissionEntity {
  @PrimaryColumn({ name: 'role_id' })
  roleId: number;

  @PrimaryColumn({ name: 'permission_id' })
  permissionId: number;

  @ManyToOne(() => RoleEntity, (role) => role.id, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  roles: RoleEntity[];

  @ManyToOne(() => PermissionEntity, (permission) => permission.id, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'permission_id', referencedColumnName: 'id' }])
  permissions: PermissionEntity[];
}

export default RolePermissionEntity;

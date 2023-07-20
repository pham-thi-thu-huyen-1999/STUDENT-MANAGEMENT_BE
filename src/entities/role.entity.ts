import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import PermissionEntity from './permission.entity';
import UserEntity from './user.entity';

interface RoleType {
  id: number;
  name: string;
  permissions: PermissionEntity[];
  users: UserEntity[];
}

@Entity({ name: 'role' })
class RoleEntity {
  constructor(data?: RoleType) {
    if (data) {
      const { id, name, permissions, users } = data;
      this.id = id;
      this.name = name;
      this.permissions = permissions;
      this.users = users;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: PermissionEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roles, {
    cascade: true,
  })
  users: UserEntity[];
}

export default RoleEntity;

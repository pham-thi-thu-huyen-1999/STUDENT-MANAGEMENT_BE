import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import RoleEntity from './role.entity';
import UserEntity from './user.entity';

@Entity({ name: 'user_role' })
class UserRoleEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'role_id' })
  roleId: number;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  users: UserEntity[];

  @ManyToOne(() => RoleEntity, (role) => role.id, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  roles: RoleEntity[];
}

export default UserRoleEntity;

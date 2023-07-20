import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from './user.entity';

@Entity({ name: 'article' })
class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'label' })
  @IsNotEmpty()
  label: string;

  @Column({ name: 'content' })
  @IsNotEmpty()
  content: string;

  @Column({ name: 'user_id' })
  @IsNotEmpty()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.articles, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;
}

export default ArticleEntity;

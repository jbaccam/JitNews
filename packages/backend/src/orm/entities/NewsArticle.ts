import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('news_articles')
export class NewsArticle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', nullable: true })
  excerpt?: string;

  @Column({ type: 'varchar', length: 255 })
  sourceUrl!: string;

  @Column({ type: 'varchar', length: 100 })
  sourceName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 50 })
  biasRating!: string;

  @Column({ type: 'int', default: 50 })
  biasScore!: number;

  @Column({ type: 'simple-array', nullable: true })
  topics?: string[];

  @Column({ type: 'simple-array', nullable: true })
  categories?: string[];

  @Column({ type: 'float', default: 0.5 })
  qualityScore!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'timestamp' })
  publishedAt!: Date;

  @CreateDateColumn()
  fetchedAt!: Date;

  @Column({ type: 'text', nullable: true })
  aiAnalysis?: string;
}
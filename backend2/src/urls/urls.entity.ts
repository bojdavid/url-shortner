import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/users.entity';

@Entity()
export class Url {
    @PrimaryGeneratedColumn('uuid')
    id: string; //uuid

    @Column()
    originalUrl: string;

    @Column()
    shortUrl: string;

    @Column({ default: 0 })
    clicks: number;

    // Foreign key — each URL belongs to a user
    @ManyToOne(() => User, (user) => user.urls, { onDelete: 'CASCADE' })
    owner: User;

    @Column({ nullable: true, type: 'timestamptz' })
    expiresAt: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

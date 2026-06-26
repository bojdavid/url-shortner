import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn, ManyToOne,
} from 'typeorm';
import { User } from "../users/user.entity";


@Entity('urls') // maps to a table called 'urls'
export class Url {
    @PrimaryGeneratedColumn('uuid')
    id: string; // UUID primary key — better than auto-increment for APIs

    @Column({ unique: true })
    code: string; // the short code e.g. 'abc123'

    @Column('text')
    originalUrl: string; // the destination

    @Column({ default: 0 })
    clicks: number;

    @Column({ nullable: true, type: 'timestamptz' })
    expiresAt: Date | null; // optional expiry

    // Foreign key — each URL belongs to a user
    @ManyToOne(() => User, (user) => user.urls, { onDelete: 'CASCADE' })
    owner: User;

    @Column() // store the owner id directly for easy queries
    ownerId: string;

    @CreateDateColumn() // auto-set on INSERT
    createdAt: Date;

    @UpdateDateColumn() // auto-set on UPDATE
    updatedAt: Date;
}
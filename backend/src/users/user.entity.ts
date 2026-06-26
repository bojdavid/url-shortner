import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, OneToMany
} from 'typeorm';
import { Url } from '../urls/urls.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string; // NEVER store plaintext passwords

    @OneToMany(() => Url, (url) => url.owner)
    urls: Url[];

    @CreateDateColumn()
    createdAt: Date;
}
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Url } from 'src/urls/urls.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Url, (url) => url.owner)
    urls: Url[];

    @UpdateDateColumn()
    updatedAt: Date;
}
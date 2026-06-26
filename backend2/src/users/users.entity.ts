import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Url } from 'src/urls/urls.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ type: 'timestamptz' })
    createdAt: Date;

    @OneToMany(() => Url, (url) => url.owner)
    urls: Url[];

    @Column({ nullable: true, type: 'timestamptz' })
    updatedAt: Date;
}
import { Url } from "src/urls/urls.entity";
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, CreateDateColumn } from "typeorm";


@Entity('clicks')
@Index(['urlId', 'clickedAt']) // speeds up 'clicks for URL X by date' queries
@Index(['urlId', 'referer']) // speeds up 'top referrers for URL X' queries

export class Click {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Url, url => url.clicks, { onDelete: 'CASCADE' })
    url: Url;

    @Column()
    @Index()
    urlId: string

    @CreateDateColumn({ type: 'timestamp' })
    clickedAt: Date;

    @Column({ type: 'varchar', nullable: true })
    referer: string | null; // http referer header

    @Column({ type: 'varchar', nullable: true })
    userAgent: string | null; // user-agent string

    // Privacy: we store a hash of the IP, never the raw address
    @Column({ type: 'varchar', nullable: true })
    ipHash: string | null;

    @Column({ type: 'varchar', nullable: true })
    country: string | null; // derived from ipAddress using a geoip package
}
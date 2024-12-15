import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('profile')
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    profile_picture_url: string;

    @Column({ type: 'varchar', length: 255 })
    bio: string;

    // Location Information
    @Column({ type: 'varchar', length: 255 })
    city: string;

    @Column({ type: 'varchar', length: 255 })
    country: string;

    @Column({ type: 'varchar', length: 255 })
    timezone: string;

    @Column({ type: 'date' })
    birthday: Date;

    @Column({ type: 'varchar', length: 255 })
    phone_number: string;

    // Social and Engagement Information
    @Column({ type: 'varchar', length: 255 })
    social_link: string;
    @OneToOne(() => User, (user) => user.profile) // specify inverse side as a second parameter
    user: User
}

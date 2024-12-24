import {
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Entity,
} from "typeorm";
import { User } from "./user.entity";
@Entity("group_chats")

export class GroupChat {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    admin: User;

    @Column({
        type: "text",
    })
    @Index()
    name: string;

    @Column({
        type: "text",
    })
    description: string;

    @Column({
        type: "int",
        default: 0,
    })
    member_count: number;

    @Column({
        type: "int",
    })
    max_member_count: number;

    @Column({
        type: "text",
    })
    logo_group: string;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

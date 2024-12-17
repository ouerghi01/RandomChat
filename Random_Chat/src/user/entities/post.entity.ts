import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("posts")
export class Post_entity {
    @PrimaryGeneratedColumn()
    id: number;
    title: string;
    content: string;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: true })
    updatedAt: Date;
    @Column({type:"text",nullable:true})
    image:string;
    @ManyToOne(() => User, user => user.posts)
    user: User;
    // marked as anonymous or identified
    isAnonymous: boolean;

}
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Reaction } from "./reaction.entity";

@Entity("posts")
export class Post_entity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "varchar", length: 255 ,nullable:true})
    title: string;
    @Column({ type: "text"  , nullable:true})
    content: string;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: true })
    updatedAt: Date;
    @Column({type:"text",nullable:true})
    image:string;
    @ManyToOne(() => User, user => user.posts)
    user: User;
    @OneToMany(() => Reaction, reaction => reaction.id)
    reactions: Reaction[];
    
    // marked as anonymous or identified
    @Column({ type: "boolean", default: false, nullable: true })
    isAnonymous: boolean;

}
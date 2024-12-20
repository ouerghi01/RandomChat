import { Post } from "@nestjs/common";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post_entity } from "./post.entity";
import { User } from "./user.entity";
export enum ReactionType {
    LIKE = "LIKE",
    LOVE = "LOVE",
    HAHA = "HAHA",
    WOW = "WOW",
    SAD = "SAD",
    ANGRY = "ANGRY",
    CARE = "CARE",
}


@Entity("reactions")
export class Reaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: ReactionType })
    reaction: ReactionType;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Post_entity, post => post.reactions)
    @Index()
    post: Post_entity;

    @ManyToOne(() => User, user => user.reactions)
    @Index()
    user: User;
}

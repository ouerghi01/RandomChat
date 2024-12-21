import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Option_entity } from "./option.entity";

@Entity("polls")
export class Poll {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: "text", 
    })
    question: string;
    @OneToOne(()=> User)
    @JoinColumn()
    user : User;
    @OneToMany(()=> Option_entity, option => option.poll)
    options : Option_entity[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}
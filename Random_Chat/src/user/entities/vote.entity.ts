import { CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Poll } from "./poll.entity";
import { Option_entity } from "./option.entity";


@Entity("votes")
export class Vote_entity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToMany(() => User)
    @JoinTable()
    users: User[];
    
    @OneToOne(() => Option_entity, (option) => option.vote)
    @JoinColumn()
    option: Option_entity;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column
    updatedAt: Date;
}
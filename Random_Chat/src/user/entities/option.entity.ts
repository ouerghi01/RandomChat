import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Poll } from "./poll.entity";
import { User } from "./user.entity";

@Entity("options")
export class Option_entity {
    @PrimaryGeneratedColumn()  // primary key
    id :number;
    @Column({type : 'text'})
    content :string;
    @ManyToOne(() => Poll, poll => poll.options)
    poll :Poll;
    @ManyToMany(() => User)
    @JoinTable()
    users :User[];
    @Column({ type : 'integer', default : 0 })
    votes :number;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column for updated_at field  // timestamp column
    updatedAt: Date;
    
}
import { Column, Entity, PrimaryGeneratedColumn ,ManyToOne, OneToMany} from "typeorm";
import { Token } from "./token.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id :number;
    @Column({type : 'varchar', length :30})
    name :string;
    @Column({type : 'varchar', length :255})
    email :string;
    @Column({type : 'int'})
    age :number;
    @Column({type:'enum', enum:['m','f']})
    gender : string;
    @Column({ type: 'varchar', length: 255 })
    password: string;
    @OneToMany(() => Token, token => token.id)
    tokens: Token[];

}

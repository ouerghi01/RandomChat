import { Column, Entity, PrimaryGeneratedColumn ,OneToMany, ManyToOne} from "typeorm";
import { User } from "./user.entity";
@Entity("tokens")
export class Token{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar', length: 255 })
    token: string;
    @ManyToOne(() => User, user => user.tokens)
    user: User;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    expired_at: Date;
}
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    title!: string;

    @Column('varchar')
    author!: string;

    @Column('varchar')
    genre!: string;

    @Column('decimal')
    price!: number;

}
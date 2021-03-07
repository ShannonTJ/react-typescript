import { Field, ObjectType } from "type-graphql";
import { Column, Entity, BaseEntity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

//many to many relationship
//user <-> posts
//user -> likes <- posts

@ObjectType()
@Entity()
export class Like extends BaseEntity {
  @Field()
  @Column({ type: "int" })
  value: number;

  @Field()
  @PrimaryColumn()
  userId: number;

  @Field()
  @PrimaryColumn()
  postId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @Field()
  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;
}

import { ObjectType } from "type-graphql";
import { Column, Entity, BaseEntity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

//many to many relationship
//user <-> posts
//user -> likes <- posts

@ObjectType()
@Entity()
export class Like extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;
}

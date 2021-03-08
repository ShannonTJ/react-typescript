import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Int,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { Post } from "../entities/Post";
import { getConnection } from "typeorm";
import { Postlike } from "../entities/Postlike";

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 100);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isLiked = value !== -1;
    const finalValue = isLiked ? 1 : -1;
    const { userId } = req.session;

    const like = await Postlike.findOne({ where: { postId, userId } });

    //user has liked the post before
    //and they are changing their vote
    if (like && like.value !== finalValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
              update postlike
              set value = $1 
              where "postId" = $2 and "userId" = $3
              `,
          [finalValue, postId, userId]
        );

        await tm.query(
          `
                update post
                set points = points + $1
                where id = $2
              `,
          [finalValue, postId]
        );
      });
    }
    //user has not liked the post before
    else if (!like) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
        insert into postlike ("userId", "postId", value)
        values ($1, $2, $3)
        `,
          [userId, postId, finalValue]
        );

        await tm.query(
          `
        update post
        set points = points + $1 
        where id = $2
        `,
          [finalValue, postId]
        );
      });
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (req.session.userId) {
      replacements.push(req.session.userId);
    }

    let cursorIndex = 3;
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
      cursorIndex = replacements.length;
    }

    //get user info with each post
    const posts = await getConnection().query(
      `
    select p.*, 
    json_build_object(
      'id', u.id,
      'username',  u.username,
      'email', u.email
      ) creator,
      ${
        req.session.userId
          ? '(select value from postlike where "userId" = $2 and "postId" = p.id) "voteStatus"'
          : 'null as "voteStatus"'
      }
    from post p
    inner join public.user u on u.id = p."creatorId"
    ${cursor ? `where p."createdAt" < $${cursorIndex}` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", "u.id = p.'creatorId'")
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(realLimitPlusOne);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }
    // const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    //fetch post
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    //update post
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}

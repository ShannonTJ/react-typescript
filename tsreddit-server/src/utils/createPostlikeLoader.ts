import DataLoader from "dataloader";
import { Postlike } from "../entities/Postlike";

export const createPostlikeLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Postlike | null>(
    async (keys) => {
      const postlikes = await Postlike.findByIds(keys as any);
      const postlikeIdsToPostlike: Record<string, Postlike> = {};
      postlikes.forEach((postlike) => {
        postlikeIdsToPostlike[
          `${postlike.userId}|${postlike.postId}}`
        ] = postlike;
      });

      return keys.map(
        (key) => postlikeIdsToPostlike[`${key.userId}|${key.postId}}`]
      );
    }
  );

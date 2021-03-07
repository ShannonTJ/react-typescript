import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment } from "../generated/graphql";
import { useVoteMutation } from "../generated/graphql";

interface LikeSectionProps {
  post: PostSnippetFragment;
}

export const LikeSection: React.FC<LikeSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "like-loading" | "unlike-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          setLoadingState("like-loading");
          await vote({ postId: post.id, value: 1 });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "like-loading"}
        aria-label="like post"
        icon={<ChevronUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          setLoadingState("unlike-loading");
          await vote({ postId: post.id, value: -1 });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "unlike-loading"}
        aria-label="unlike post"
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};

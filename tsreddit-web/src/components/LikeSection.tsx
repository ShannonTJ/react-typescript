import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment } from "../generated/graphql";
import { useVoteMutation } from "../generated/graphql";

interface LikeSectionProps {
  post: PostSnippetFragment;
}

export const LikeSection: React.FC<LikeSectionProps> = ({ post }) => {
  const [{ fetching, operation }, vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          await vote({ postId: post.id, value: 1 });
        }}
        isLoading={fetching && operation?.variables?.value === 1}
        aria-label="like post"
        icon={<ChevronUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          await vote({ postId: post.id, value: -1 });
        }}
        isLoading={fetching && operation?.variables?.value === -1}
        aria-label="unlike post"
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};

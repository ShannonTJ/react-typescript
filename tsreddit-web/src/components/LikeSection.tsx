import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";

interface LikeSectionProps {
  post: PostSnippetFragment;
}

export const LikeSection: React.FC<LikeSectionProps> = ({ post }) => {
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton aria-label="like post" icon={<ChevronUpIcon />} />
      {post.points}
      <IconButton aria-label="unlike post" icon={<ChevronDownIcon />} />
    </Flex>
  );
};

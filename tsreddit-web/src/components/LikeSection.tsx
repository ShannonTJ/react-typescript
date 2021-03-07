import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { PostsQuery } from "../generated/graphql";

interface LikeSectionProps {
  post: PostsQuery["posts"]["posts"][0];
}

export const LikeSection: React.FC<LikeSectionProps> = ({}) => {
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton aria-label="like post" icon={<ChevronUpIcon />} />
      {p.points}
      <IconButton aria-label="unlike post" icon={<ChevronDownIcon />} />
    </Flex>
  );
};

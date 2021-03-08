import React from "react";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;

  //data is loading
  if (fetching) {
  }
  //user not logged in
  else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={2}>
            login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">register</Link>
        </NextLink>
      </>
    );
  }
  //user is logged in
  else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={4} colorScheme="green">
            create post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex position="sticky" top={0} z-index={1} bg="teal" p={4} align="center">
      <Flex flex={1} m="auto" maxW={800} align="center">
        <NextLink href="/">
          <Link>
            <Heading>TSreddit</Heading>
          </Link>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};

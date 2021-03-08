import React from "react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { usePostQuery } from "../../generated/graphql";

export const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  return <div></div>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);

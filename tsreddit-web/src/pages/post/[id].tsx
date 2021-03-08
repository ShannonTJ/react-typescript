import React from "react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../../utils/createUrqlClient";

export const Post = ({}) => {
  const router = useRouter();
  router.query.id;
  return <div></div>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);

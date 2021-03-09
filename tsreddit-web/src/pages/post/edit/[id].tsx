import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { Layout } from "../../../components/Layout";

export const EditPost = ({}) => {
  return <Layout>edit page</Layout>;
};

export default withUrqlClient(createUrqlClient)(EditPost);

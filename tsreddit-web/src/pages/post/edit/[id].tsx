import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { Layout } from "../../../components/Layout";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputField } from "../../../components/InputField";
import { Wrapper } from "../../../components/Wrapper";
import { useGetPostFromUrl } from "../../../utils/useGetPostFromUrl";

export const EditPost = ({}) => {
  const [{ data, fetching }] = useGetPostFromUrl();

  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }
  return (
    <Layout variant="small">
      <Wrapper variant="small">
        <Formik
          initialValues={{ title: "", text: "" }}
          onSubmit={async (values) => {
            // const { error } = await createPost({ input: values });
            // if (!error) {
            //   router.push("/");
            // }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="title" placeholder="title" label="Title" />
              <Box mt={4}>
                <InputField
                  textarea
                  name="text"
                  placeholder="text..."
                  label="Body"
                />
              </Box>

              <Button
                isLoading={isSubmitting}
                mt={4}
                type="submit"
                colorScheme="blue"
                color="white"
              >
                Update Post
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);

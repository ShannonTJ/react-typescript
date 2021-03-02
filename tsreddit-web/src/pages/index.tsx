import { Navbar } from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Navbar />
      <div color="white">hello world</div> <br />
      {!data
        ? null
        : data!.posts.map((p) => (
            <p color="white" key={p.id}>
              {p.title}
            </p>
          ))}
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Index);

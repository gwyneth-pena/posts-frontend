import { POSTS_QUERY } from "./graphql/posts.query.";
import { createUrqlClient } from "./lib/urql-client";

export default async function Home() {
  const { client }: any = createUrqlClient();
  const posts = await client
    .query(
      POSTS_QUERY,
      {},
      {
        requestPolicy: "cache-and-network",
      }
    )
    .toPromise();
  return (
    <>
      <h1>Welcome to MyPosts</h1>
      {posts.data?.posts.map((post: any) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.text}</p>
        </div>
      ))}
    </>
  );
}

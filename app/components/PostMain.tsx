"use client";

import { format } from "date-fns";
import { POSTS_GET_ONE_QUERY } from "../graphql/posts.query.";
import { useQuery } from "urql";
import PostMenu from "./PostMenu";

export default function PostMain({ slug }: { slug: string }) {
  const [{ data: postData }] = useQuery({
    query: POSTS_GET_ONE_QUERY,
    variables: { slug },
    requestPolicy: "cache-and-network",
  });

  if (!postData?.post) {
    return <p>Loading...</p>;
  }

  const post = postData.post;

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <h2 className="text-center me-2">{post.title}</h2>
        {post.isOwner && (
          <>
            <PostMenu post={post} fromSinglePost={true} />
          </>
        )}
      </div>

      <p className="text-muted text-center">{post.user.username}</p>

      <div
        className="mt-5 mb-3"
        dangerouslySetInnerHTML={{ __html: post.text }}
      ></div>

      <small className="text-muted">
        Date Posted: {format(new Date(Number(post.createdAt)), "PPP 'at' p")}
      </small>
    </>
  );
}

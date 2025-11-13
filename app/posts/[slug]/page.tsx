import PostCommentSection from "@/app/components/PostCommentSection";
import PostMain from "@/app/components/PostMain";
import { POSTS_GET_ONE_QUERY } from "@/app/graphql/posts.query";
import { createUrqlClient } from "@/app/lib/urql-server";
import { Container, Flex } from "@chakra-ui/react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const postSlug = resolvedParams.slug;

  const { client } = await createUrqlClient();

  const res = await client
    .query(POSTS_GET_ONE_QUERY, { slug: postSlug })
    .toPromise();

  if (!res.data?.post) {
    redirect("/");
  }

  const title = res.data?.post?.title ?? "Post";
  const username = res.data?.post?.user?.username ?? "User";

  return {
    title: `${username} - ${title}`,
    description: `View the post by ${username} on MyPosts`,
  };
}

export default async function Post({ params }: any) {
  const data = await params;
  const slug = data?.slug ?? null;

  return (
    <Flex minH="80vh" bg="gray.100" justifyContent="center">
      <Container
        maxW="100%"
        bg="gray.100"
        py={[4, 6, 8, 10]}
        px={[4, 8, 12, 20]}
        mx={[2, 4, 10, 20]}
      >
        <PostMain slug={slug} />
        <div className="mt-4">
          <PostCommentSection slug={slug} />
        </div>
      </Container>
    </Flex>
  );
}

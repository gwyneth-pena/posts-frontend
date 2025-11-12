import { gql } from "urql";

export const POSTS_QUERY = gql`
  query Posts(
    $likedByUsername: String
    $username: String
    $limit: Int
    $offset: Int
  ) {
    posts(
      likedByUsername: $likedByUsername
      username: $username
      limit: $limit
      offset: $offset
    ) {
      id
      title
      text
      createdAt
      updatedAt
      slug
      user {
        username
        email
      }
      commentCount
      likeCount
      dislikeCount
      userVote
      isOwner
    }
    totalPosts(username: $username)
  }
`;

export const POSTS_GET_ONE_QUERY = gql`
  query Post($id: ID, $slug: String!) {
    post(id: $id, slug: $slug) {
      id
      title
      text
      slug
      createdAt
      updatedAt
      user {
        username
        email
      }
      commentCount
      likeCount
      dislikeCount
      userVote
      isOwner
    }
  }
`;

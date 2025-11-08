import { gql } from "urql";

export const POSTS_QUERY = gql`
  query Posts($limit: Int, $offset: Int) {
    posts(limit: $limit, offset: $offset) {
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
    totalPosts
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

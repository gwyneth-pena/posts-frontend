import { gql } from "urql";

export const POSTS_QUERY = gql`
  query Posts {
    posts {
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

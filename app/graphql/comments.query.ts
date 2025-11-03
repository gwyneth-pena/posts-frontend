import { gql } from "urql";

export const COMMENTS_BY_POST_QUERY = gql`
  query CommentsByPost($postId: ID!) {
    commentsByPost(postId: $postId) {
      id
      text
      createdAt
      updatedAt
      user {
        username
        email
      }
    }
  }
`;

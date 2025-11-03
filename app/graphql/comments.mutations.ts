import { gql } from "urql";

export const COMMENTS_CREATE_MUTATION = gql`
  mutation CreateComment($text: String!, $postId: ID!) {
    createComment(text: $text, postId: $postId) {
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

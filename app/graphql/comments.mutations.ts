import { gql } from "urql";

export const COMMENTS_CREATE_MUTATION = gql`
  mutation CreateComment($text: String!, $postId: ID!, $parentId: ID) {
    createComment(text: $text, postId: $postId, parentId: $parentId) {
      id
      text
      createdAt
      updatedAt
      user {
        username
        email
      }
      children {
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
  }
`;

export const COMMENT_DELETE_MUTATION = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

export const COMMENT_UPDATE_MUTATION = gql`
  mutation UpdateComment($id: ID!, $text: String!) {
    updateComment(id: $id, text: $text) {
      id
      text
      createdAt
      updatedAt
      user {
        username
        email
      }
      children {
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
  }
`;

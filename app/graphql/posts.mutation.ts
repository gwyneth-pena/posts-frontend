import { gql } from "urql";

export const POSTS_CREATE_MUTATION = gql`
  mutation CreatePost($title: String!, $text: String!) {
    createPost(title: $title, text: $text) {
      id
      title
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

export const POSTS_UPDATE_MUTATION = gql`
  mutation UpdatePost($id: ID!, $title: String!, $text: String!) {
    updatePost(id: $id, title: $title, text: $text) {
      id
      title
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

export const POSTS_DELETE_MUTATION = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

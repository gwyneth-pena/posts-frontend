import { gql } from "urql";

export const POSTS_QUERY = gql`
  query Posts {
    posts {
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

export const POSTS_GET_ONE_QUERY = gql`
  query Post($id: ID!) {
    post(id: $id) {
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

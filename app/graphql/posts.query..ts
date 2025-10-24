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
        id
        username
        email
      }
    }
  }
`;

import { gql } from "urql";

export const USER_ME_QUERY = gql`
  query UserMe {
    userMe {
      id
      username
      email
    }
  }
`;

export const USER_QUERY = gql`
  query User($username: String!) {
    user(username: $username) { 
      id
      username
      email
    }
  }
`;

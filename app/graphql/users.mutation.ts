import { gql } from "urql";

export type ModifyUserInput = {
  username: string;
  email?: string;
  password: string;
};

export const USER_CREATE_MUTATION = gql`
  mutation CreateUser($data: ModifyUserInput) {
    createUser(data: $data) {
      username
      email
    }
  }
`;

export const USER_LOGIN_MUTATION = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      username
    }
  }
`;

export const USER_LOGOUT_MUTATION = gql`
  mutation LogoutUser {
    logoutUser
  }
`

export const USER_SEND_RESET_PASSWORD_LINK_MUTATION = gql`
  mutation SendResetPasswordEmail($email: String!) {
    sendResetPasswordEmail(email: $email)
  }
`;

export const USER_RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword(
    $selector: String!
    $token: String!
    $password: String!
  ) {
    resetPassword(selector: $selector, token: $token, password: $password)
  }
`;

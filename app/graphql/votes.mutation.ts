import { gql } from "urql";

export const VOTE_CREATE_MUTATION = gql`
  mutation CreateVote($value: Int!, $postId: ID!) {
    createVote(value: $value, postId: $postId) {
      id
      value
    }
  }
`;

export const VOTE_UPDATE_BY_POST_ID_MUTATION = gql`
  mutation UpdateVoteByPost($value: Int!, $postId: ID!) {
    updateVoteByPost(value: $value, postId: $postId) {
      id
      value
    }
  }
`;

export const VOTE_DELETE_BY_POST_ID_MUTATION = gql`
  mutation DeleteVoteByPost($postId: ID!) {
    deleteVoteByPost(postId: $postId)
  }
`;

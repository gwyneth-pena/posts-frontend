import { gql } from "urql";

export const USER_ME_QUERY = gql`
    query UserMe {
        userMe {
            id
            username
            email
        }
    }
`
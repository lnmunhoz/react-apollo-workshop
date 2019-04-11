import { gql } from "apollo-boost";

export const REPOSITORY_FIELDS = gql`
  fragment RepositoryFields on Repository {
    id
    name
    viewerHasStarred
    stargazers {
      totalCount
    }
    owner {
      avatarUrl
      login
    }
  }
`;

export const SEARCH_QUERY = gql`
  query SearchRepos($query: String!) {
    search(first: 10, type: REPOSITORY, query: $query) {
      nodes {
        __typename
        ... on Repository {
          ...RepositoryFields
        }
      }
    }
  }
  ${REPOSITORY_FIELDS}
`;

export const ADD_STAR_MUTATION = gql`
  mutation StarRepo($repoId: ID!) {
    addStar(input: { starrableId: $repoId }) {
      starrable {
        ...RepositoryFields
      }
    }
  }
  ${REPOSITORY_FIELDS}
`;

export const REMOVE_STAR_MUTATION = gql`
  mutation StarRepo($repoId: ID!) {
    removeStar(input: { starrableId: $repoId }) {
      starrable {
        ...RepositoryFields
      }
    }
  }
  ${REPOSITORY_FIELDS}
`;

import { parse } from 'graphql';

export function getAst({ query, variables }, isAppSyncSelectionSet = false) {
  const ast = parse(query);

  const operation = ast.definitions.find(
    (x) => x.kind === 'OperationDefinition',
  );

  const fragments = ast.definitions
    .filter((x) => x.kind === 'FragmentDefinition')
    .reduce((acc, fragment) => {
      acc[fragment.name.value] = fragment;
      return acc;
    }, {});

  return {
    fieldNodes: operation.selectionSet.selections,
    variableValues: variables,
    fragments: !isAppSyncSelectionSet ? fragments : null,
  };
}

export const example = {
  query: /* GraphQL */ `
    query($where: CommentFilterInput!) {
      blog(id: "blog_1") {
        id
        title

        author(id: "author_1") {
          name
        }

        comment(where: { id: "comment_1" }) {
          id
        }

        comments(where: $where) {
          id
          message
          author

          likes(where: { type: "heart" }) {
            actor {
              ...Person
            }
          }
        }
      }
    }

    fragment Person on Actor {
      name
      email
    }
  `,
  variables: {
    where: {
      id: 'comment_2',
    },
  },
};

export const ast = getAst(example);

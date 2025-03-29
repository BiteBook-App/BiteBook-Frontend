import {gql} from '@apollo/client'

export const GET_RECIPES = gql`
  query GetRecipe {
      getRecipe(recipeUid: "OA3NkEzSqFdKM26Hvf1x") {
        userId
        uid
        url
        name
        photoUrl
        likes
        createdAt
        steps {
          expanded
          text
        }
        ingredients {
          count
          name
        }
        tastes
      }
  }
`;

export const EDIT_RECIPE = gql`
    mutation EditRecipe($recipeData: RecipeInput!) {
        editRecipe(recipeData: $recipeData, recipeId: "OA3NkEzSqFdKM26Hvf1x") {
            uid
        }
   }
`;
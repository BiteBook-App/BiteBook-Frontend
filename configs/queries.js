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

export const GET_RECIPE_PREVIEW = gql`
  query GetRecipePreview($userId: String) {
    getRecipes(userId: $userId) {
      createdAt
      name
      photoUrl
      tastes
      uid
    }
  }
`;

export const GET_PROFILE = gql`
  query MyQuery($uid: String) {
    getUsers(uid: $uid) {
      displayName
      profilePicture
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

export const EDIT_USER = gql`
  mutation EditUser($userId: String!, $displayName: String, $profilePicture: String) {
      editUser(userId: $userId, displayName: $displayName, profilePicture: $profilePicture) {
          uid
          displayName
          profilePicture
      }
  }
`;
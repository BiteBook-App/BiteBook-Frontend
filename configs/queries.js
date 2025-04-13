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
      lastUpdatedAt
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

export const GET_RECIPE = gql`
  query GetRecipe($recipeUid: String!) {
    getRecipe(recipeUid: $recipeUid) {
      userId
      uid
      url
      name
      photoUrl
      hasCooked
      likes
      createdAt
      lastUpdatedAt
      steps {
        expanded
        text
      }
      ingredients {
        count
        name
      }
      tastes
      user {
        displayName
        profilePicture
      }
    }
  }
`;

export const GET_RECIPE_PREVIEW = gql`
  query GetRecipePreview($userId: String) {
    getRecipes(userId: $userId, hasCooked: true) {
      createdAt
      lastUpdatedAt
      name
      photoUrl
      tastes
      uid
    }
  }
`;

export const GET_DRAFT_PREVIEW = gql`
  query GetDraftPreview($userId: String) {
    getRecipes(userId: $userId, hasCooked: false) {
      createdAt
      lastUpdatedAt
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
      relationships
    }
  }
`;

export const EDIT_RECIPE = gql`
  mutation EditRecipe($recipeData: RecipeInput!, $recipeId: String!) {
      editRecipe(recipeData: $recipeData, recipeId: $recipeId) {
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

export const CREATE_RECIPE = gql`
 mutation CreateRecipe($recipeData: RecipeInput!) {
      createRecipe(recipeData: $recipeData) {
        uid
      }
    }
`;

export const GET_HOME_PAGE = gql`
  query getHomePage($userId: String!, $numRecipes: Int!) {
    getHomePageRecipes(userId: $userId, numRecipes: $numRecipes) {
      name
      photoUrl
      likes
      tastes
      createdAt
      lastUpdatedAt
      user {
        displayName
        profilePicture
      }
    }
  }
`;
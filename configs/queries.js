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
        uid
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
      uid
      user {
        displayName
        profilePicture
        uid
      }
    }
  }
`;

export const GET_USER_FROM_RECIPE = gql`
  query GetRecipe($recipeUid: String!) {
    getRecipe(recipeUid: $recipeUid) {
      uid
      user {
        displayName
        profilePicture
        uid
      }
    }
  }
`;

export const CREATE_RELATIONSHIP = gql`
 mutation MyMutation($relationshipData: RelationshipInput!) {
  createRelationship(relationshipData: $relationshipData)
 }
`;

export const GET_TASTE_PROFILE = gql`
  query GetTasteProfile($userId: String!) {
    getTastePageInfo(userId: $userId) {
      recommendations {
        uid
        photoUrl
        name
        tastes
        user {
          displayName
          profilePicture
          uid
        }
      }
      tastePercentages {
        percentage
        taste
      }
      numRecipes
      numTasteProfiles
    }
  }
`;

export const DELETE_RECIPE = gql`
 mutation MyMutation($recipeId: String!) {
  deleteRecipe(recipeId: $recipeId)
 }
`;

export const GET_FRIENDS = gql`
  query GetFriends($userId: String!) {
    getFriends(userId: $userId) {
      displayName
      profilePicture
      uid
      createdAt
    }
  }
`;

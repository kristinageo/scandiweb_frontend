import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
     getCategories {
      id
      name
    }
  }
`;


export const GET_PRODUCTS = gql`
  query GetProducts {
     getProducts {
      id
      name
      inStock
      description
      gallery
      price
      brand
      category {
        id
        name
      }
      attributes {
       name
       items{
          displayValue
          value
          id
       }
      }
    }
  }
`;





export const CREATE_CATEGORIES = gql`
  mutation CreateCategories {
    createCategories {
      id
      name
    }
  }
`;


export const CREATE_PRODUCTS = gql`
  mutation CreateProducts {
    createProducts {
      id
      name
      category {
        id
        name
      }
      inStock
      description
      gallery
      price
      brand
      attributes {
        name
        items
        {
            displayValue
            value
            id
        }
      }
    }
  }
`;


export const INSERT_ORDER = gql`
  mutation InsertOrder($quantity: Int!, $totalPrice: Float!, $cart: [CartItemInput!]!) {
    insertOrder(totalPrice: $totalPrice, quantity: $quantity, cart: $cart) {
      id
      totalPrice
      quantity
      cartItems {
        id
        name
        price
        quantity
        selectedItems {
          attributeName
          value
        }
      }
    }
  }
`;
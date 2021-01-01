import { ProductsListState } from '../../store';
import { ProductListActions, ProductsListActionTypes } from '../../action-types';

export const initialState: ProductsListState = {
  productItems: [],
  productItemsFetchState: {
    loading: false,
    loaded: false,
  },
  totalProductsCount: 0,
};

const productsListReducer = (
  state: ProductsListState = initialState,
  action: ProductListActions,
): ProductsListState => {
  switch (action.type) {
    case ProductsListActionTypes.Request:
      return {
        ...state,
        productItemsFetchState: {
          loading: true,
          loaded: false,
          loadingMessage: action.requestMessage,
        },
      };
    case ProductsListActionTypes.Success:
      return {
        ...state,
        productItems: action.data.productItems,
        productItemsFetchState: {
          loading: false,
          loaded: true,
        },
        totalProductsCount: action.data.totalProductsCount,
      };
    case ProductsListActionTypes.Error:
      return {
        ...state,
        productItemsFetchState: {
          loading: false,
          loaded: false,
          error: action.errorMessage,
        },
      };

    default:
      return state;
  }
};

export default productsListReducer;
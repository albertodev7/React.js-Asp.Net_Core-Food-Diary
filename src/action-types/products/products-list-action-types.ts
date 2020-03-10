import { Action } from 'redux';
import { ProductItem } from '../../models';

export enum ProductsListActionTypes {
  Request = 'PRODUCTS_LIST__REQUEST',
  Success = 'PRODUCTS_LIST__SUCCESS',
  Error = 'PRODUCTS_LIST__ERROR',
}

export interface GetProductsListRequestAction extends Action<ProductsListActionTypes.Request> {
  type: ProductsListActionTypes.Request;
}

export interface GetProductsListSuccessAction extends Action<ProductsListActionTypes.Success> {
  type: ProductsListActionTypes.Success;
  productItems: ProductItem[];
}

export interface GetProductsListErrorAction extends Action<ProductsListActionTypes.Error> {
  type: ProductsListActionTypes.Error;
  errorMessage: string;
}

export type ProductListActions =
  | GetProductsListRequestAction
  | GetProductsListSuccessAction
  | GetProductsListErrorAction;

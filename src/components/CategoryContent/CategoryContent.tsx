import React, { useEffect } from 'react';
import ProductsTableConnected from '../ProductsTable';
import {
  CategoryContentStateToPropsMapResult,
  CategoryContentDispatchToPropsMapResult,
} from './CategoryContentConnected';
import ProductInputConnected from '../ProductInput';
import { useIdFromRoute } from '../../hooks';
import { Container } from '../__ui__';

interface CategoryContentProps extends CategoryContentStateToPropsMapResult, CategoryContentDispatchToPropsMapResult {}

const CategoryContent: React.FC<CategoryContentProps> = ({
  productsFilter,
  updateProductsFilter,
}: CategoryContentProps) => {
  const categoryId = useIdFromRoute();

  useEffect(() => {
    if (productsFilter.categoryId !== categoryId) {
      updateProductsFilter({
        ...productsFilter,
        categoryId,
      });
    }
  }, [updateProductsFilter, productsFilter, categoryId]);

  // Removes redundant requests inside ProductsTable component
  // by simply not allowing it to render and perform any action if category is unknown
  if (!productsFilter.categoryId || productsFilter.categoryId !== categoryId) {
    return null;
  }

  return (
    <React.Fragment>
      <h1>Products</h1>
      <Container direction="column" spaceBetweenChildren="medium">
        <ProductInputConnected refreshCategoriesOnCreateProduct={true}></ProductInputConnected>
        <ProductsTableConnected refreshCategoriesOnDeleteProduct={true}></ProductsTableConnected>
      </Container>
    </React.Fragment>
  );
};

export default CategoryContent;

import { Box, Button, Paper, TextField } from '@mui/material';
import { type FC, type FocusEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CategorySelect, categoriesApi } from 'src/features/categories';
import { type SelectOption } from 'src/types';
import { useAppSelector, useValidatedTextInput } from '../../__shared__/hooks';
import { useFilterStyles } from '../../__shared__/styles';
import { filterByCategoryChanged, filterReset, productSearchNameChanged } from '../store';

const ProductsFilter: FC = () => {
  const classes = useFilterStyles();

  const filterProductName = useAppSelector(state => state.products.filter.productSearchName ?? '');
  const filterCategory = useAppSelector(state => state.products.filter.category);
  const filterChanged = useAppSelector(state => state.products.filter.changed);
  const [getCategories, categoriesRequest] = categoriesApi.useLazyGetCategorySelectOptionsQuery();

  const dispatch = useDispatch();

  const [, setProductSearchName, bindProductSearchName] = useValidatedTextInput(filterProductName, {
    validate: productName => productName.length >= 0 && productName.length <= 50,
    errorHelperText: 'Product search name is invalid',
  });

  const [category, setCategory] = useState(filterCategory);

  useEffect(() => {
    setProductSearchName(filterProductName);
  }, [filterProductName, setProductSearchName]);

  useEffect(() => {
    setCategory(filterCategory);
  }, [filterCategory]);

  const handleProductSearchNameBlur = (event: FocusEvent<HTMLInputElement>): void => {
    dispatch(productSearchNameChanged(event.target.value));
  };

  const handleCategoryChange = (value: SelectOption | null): void => {
    setCategory(value);
    dispatch(filterByCategoryChanged(value));
  };

  const handleReset = (): void => {
    dispatch(filterReset());
  };

  const handleLoadCategories = async (): Promise<void> => {
    await getCategories();
  };

  return (
    <Box component={Paper} className={classes.root}>
      <TextField
        {...bindProductSearchName()}
        label="Search by name"
        placeholder="Enter product name"
        fullWidth
        margin="normal"
        onBlur={handleProductSearchNameBlur}
      />
      <CategorySelect
        label="Filter by category"
        placeholder="Select a category"
        value={category}
        setValue={handleCategoryChange}
        options={categoriesRequest.data ?? []}
        optionsLoaded={!categoriesRequest.isUninitialized}
        optionsLoading={categoriesRequest.isLoading}
        onLoadOptions={handleLoadCategories}
      />
      <Box className={classes.controls}>
        <Button variant="text" disabled={!filterChanged} onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default ProductsFilter;

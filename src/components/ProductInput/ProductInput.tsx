import React, { useState } from 'react';
import './ProductInput.scss';
import { FormGroup, Input, Label, Button, DropdownList, categoryDropdownItemRenderer } from '../Controls';
import Loader from '../Loader';
import { StateToPropsMapResult, DispatchToPropsMapResult } from './ProductInputConnected';
import { CreateProductSuccessAction } from '../../action-types';
import { useDebounce } from '../../hooks';

interface ProductInputProps extends StateToPropsMapResult, DispatchToPropsMapResult {}

const ProductInput: React.FC<ProductInputProps> = ({
  productOperationStatus,
  productItemsFetchState,
  categoryDropdownItems,
  isCategoryDropdownContentLoading,
  createProduct,
  getProducts,
  getCategoryDropdownItems,
}: ProductInputProps) => {
  const [productNameInputValue, setProductNameInputValue] = useState('');
  const [caloriesCost, setCaloriesCost] = useState(100);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryNameInputValue, setCategoryNameInputValue] = useState('');

  const { performing: isOperationInProcess, message: operationMessage } = productOperationStatus;
  const { loading: isProductsTableLoading } = productItemsFetchState;

  const isAnyInputValueEmpty = productNameInputValue === '' || caloriesCost < 1 || categoryId < 1;
  const isInputDisabled = isOperationInProcess || isProductsTableLoading;
  const isAddButtonDisabled = isInputDisabled || isAnyInputValueEmpty;

  const categoryNameChangeDebounce = useDebounce(() => {
    getCategoryDropdownItems();
  });

  const handleProductNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    setProductNameInputValue(target.value);
  };

  const handleCaloriesCostChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    const caloriesCostNumber = !isNaN(+target.value) ? +target.value : 0;
    setCaloriesCost(caloriesCostNumber);
  };

  const handleCategoryDropdownItemSelect = (newSelectedCategoryIndex: number): void => {
    const { id, name } = categoryDropdownItems[newSelectedCategoryIndex];
    setCategoryId(id);
    setCategoryNameInputValue(name);
  };

  const handleCategoryNameDropdownInputChange = (newCategoryNameInputValue: string): void => {
    setCategoryNameInputValue(newCategoryNameInputValue);
    categoryNameChangeDebounce();
  };

  const handleCategoryDropdownContentOpen = (): void => {
    getCategoryDropdownItems();
  };

  const handleAddButtonClick = async (): Promise<void> => {
    const createProductAction = await createProduct({
      id: 0,
      name: productNameInputValue,
      caloriesCost,
      categoryId,
    });

    if (createProductAction as CreateProductSuccessAction) {
      await getProducts();
      setProductNameInputValue('');
      setCaloriesCost(100);
      setCategoryId(0);
      setCategoryNameInputValue('');
    }
  };

  return (
    <div className="product-input">
      <div className="product-input__name">
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            placeholder="New product name"
            value={productNameInputValue}
            onChange={handleProductNameChange}
            disabled={isInputDisabled}
          ></Input>
        </FormGroup>
      </div>
      <div className="product-input__calories">
        <FormGroup>
          <Label>Calories cost</Label>
          <Input
            type="number"
            placeholder="Calories per 100g"
            value={caloriesCost}
            onChange={handleCaloriesCostChange}
            disabled={isInputDisabled}
          ></Input>
        </FormGroup>
      </div>
      <div className="product-input__category">
        <FormGroup>
          <Label>Category</Label>
          <DropdownList
            items={categoryDropdownItems}
            itemRenderer={categoryDropdownItemRenderer}
            placeholder="Select category"
            searchable={true}
            inputValue={categoryNameInputValue}
            isContentLoading={isCategoryDropdownContentLoading}
            disabled={isInputDisabled}
            onValueSelect={handleCategoryDropdownItemSelect}
            onInputValueChange={handleCategoryNameDropdownInputChange}
            onContentOpen={handleCategoryDropdownContentOpen}
          ></DropdownList>
        </FormGroup>
      </div>
      <div className="product-input__add">
        <Button onClick={handleAddButtonClick} disabled={isAddButtonDisabled}>
          Add
        </Button>
      </div>
      {isOperationInProcess && (
        <div className="product-input__loader">
          <Loader size="small" label={operationMessage}></Loader>
        </div>
      )}
    </div>
  );
};

export default ProductInput;

import EditIcon from '@mui/icons-material/Edit';
import { Checkbox, IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { type FC, useEffect, useState } from 'react';
import { categoriesApi } from 'src/features/categories';
import { useAppDispatch, useAppSelector } from '../../__shared__/hooks';
import { productsApi } from '../api';
import { toEditProductRequest, toProductFormData } from '../mapping';
import { selectCheckedProductIds } from '../selectors';
import { productChecked, productUnchecked } from '../store';
import { type Product, type ProductFormData } from '../types';
import ProductInputDialog from './ProductInputDialog';

interface ProductsTableRowProps {
  product: Product;
}

const ProductsTableRow: FC<ProductsTableRowProps> = ({ product }: ProductsTableRowProps) => {
  const [isEditDialogOpened, setIsEditDialogOpened] = useState(false);
  const [editProduct, editProductRequest] = productsApi.useEditProductMutation();
  const [getCategories, categoriesRequest] = categoriesApi.useLazyGetCategorySelectOptionsQuery();
  const dispatch = useAppDispatch();
  const checkedProductIds = useAppSelector(selectCheckedProductIds);
  const isChecked = checkedProductIds.some(id => id === product.id);

  useEffect(() => {
    if (editProductRequest.isSuccess) {
      setIsEditDialogOpened(false);
    }
  }, [editProductRequest.isSuccess]);

  const handleEditClick = (): void => {
    setIsEditDialogOpened(true);
  };

  const handleEditDialogSubmit = (formData: ProductFormData): void => {
    const request = toEditProductRequest(product.id, formData);
    void editProduct(request);
  };

  const handleCheckedChange = (): void => {
    if (isChecked) {
      dispatch(productUnchecked(product.id));
    } else {
      dispatch(productChecked(product.id));
    }
  };

  const handleLoadCategories = async (): Promise<void> => {
    await getCategories();
  };

  return (
    <>
      <TableRow hover selected={isChecked}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isChecked}
            onChange={handleCheckedChange}
            inputProps={{
              'aria-label': `Select ${product.name}`,
            }}
          />
        </TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell
          align="right"
          aria-label={`${product.name} calories cost is ${product.caloriesCost}`}
        >
          {product.caloriesCost}
        </TableCell>
        <TableCell
          align="right"
          aria-label={`${product.name} default quantity is ${product.defaultQuantity}`}
        >
          {product.defaultQuantity}
        </TableCell>
        <TableCell aria-label={`${product.name} is in ${product.categoryName} category`}>
          {product.categoryName}
        </TableCell>
        <TableCell>
          <Tooltip title="Edit product">
            <span>
              <IconButton
                onClick={handleEditClick}
                size="large"
                aria-label={`Open edit product dialog for ${product.name}`}
              >
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
        </TableCell>
      </TableRow>

      <ProductInputDialog
        isOpened={isEditDialogOpened}
        setIsOpened={setIsEditDialogOpened}
        title="Edit product"
        submitText="Save"
        onSubmit={handleEditDialogSubmit}
        isLoading={editProductRequest.isLoading}
        product={toProductFormData(product)}
        categories={categoriesRequest.data ?? []}
        categoriesLoaded={!categoriesRequest.isUninitialized}
        categoriesLoading={categoriesRequest.isLoading}
        onLoadCategories={handleLoadCategories}
      />
    </>
  );
};

export default ProductsTableRow;
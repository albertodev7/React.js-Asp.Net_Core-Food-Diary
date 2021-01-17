import React, { useState } from 'react';
import { Checkbox, IconButton, TableCell, TableRow, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { ProductCreateEdit, ProductItem } from '../models';
import ProductCreateEditDialog from './ProductCreateEditDialog';

type ProductsTableRowProps = {
  product: ProductItem;
};

const ProductsTableRow: React.FC<ProductsTableRowProps> = ({ product }: ProductsTableRowProps) => {
  const [productCreateEditDialogOpen, setProductCreateEditDialogOpen] = useState(false);

  const handleEditClick = (): void => {
    setProductCreateEditDialogOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateEditDialogConfirm = (product: ProductCreateEdit): void => {
    setProductCreateEditDialogOpen(false);
  };

  const handleCreateEditDialogClose = (): void => {
    setProductCreateEditDialogOpen(false);
  };

  return (
    <TableRow>
      <ProductCreateEditDialog
        open={productCreateEditDialogOpen}
        onClose={handleCreateEditDialogClose}
        onDialogConfirm={handleCreateEditDialogConfirm}
        onDialogCancel={handleCreateEditDialogClose}
        product={product}
      ></ProductCreateEditDialog>
      <TableCell padding="checkbox">
        <Checkbox disabled></Checkbox>
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.caloriesCost}</TableCell>
      <TableCell>{product.categoryName}</TableCell>
      <TableCell>
        <Tooltip title="Edit product">
          <span>
            <IconButton onClick={handleEditClick}>
              <EditIcon></EditIcon>
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default ProductsTableRow;
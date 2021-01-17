import React, { useState } from 'react';
import { IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useToolbarStyles } from '../../__shared__/styles';
import ProductCreateEditDialog from './ProductCreateEditDialog';
import { ProductCreateEdit } from '../models';

const ProductsTableToolbar: React.FC = () => {
  const classes = useToolbarStyles();
  const [productCreateEditDialogOpen, setProductCreateEditDialogOpen] = useState(false);

  const handleAddClick = (): void => {
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
    <Toolbar className={classes.root}>
      <ProductCreateEditDialog
        open={productCreateEditDialogOpen}
        onClose={handleCreateEditDialogClose}
        onDialogConfirm={handleCreateEditDialogConfirm}
        onDialogCancel={handleCreateEditDialogClose}
      ></ProductCreateEditDialog>
      <Typography variant="h1" className={classes.title}>
        Products
      </Typography>
      <Tooltip title="Add new product">
        <span>
          <IconButton onClick={handleAddClick}>
            <AddIcon></AddIcon>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Filter products">
        <span>
          <IconButton disabled>
            <FilterListIcon></FilterListIcon>
          </IconButton>
        </span>
      </Tooltip>
    </Toolbar>
  );
};

export default ProductsTableToolbar;
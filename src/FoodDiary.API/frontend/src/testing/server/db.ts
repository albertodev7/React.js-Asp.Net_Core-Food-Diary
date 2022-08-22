import { drop, factory, primaryKey } from '@mswjs/data';

export const db = factory({
  product: {
    id: primaryKey(Number),
    name: String,
    caloriesCost: Number,
    categoryId: Number,
    categoryName: String,
  },

  category: {
    id: primaryKey(Number),
    name: String,
    countProducts: Number,
  },
});

export function initializeDb() {
  drop(db);
  initializeCategories();
  initializeProducts();
}

function initializeCategories() {
  db.category.create({
    id: 1,
    name: 'Bakery',
    countProducts: 1,
  });

  db.category.create({
    id: 2,
    name: 'Cereals',
    countProducts: 5,
  });

  db.category.create({
    id: 3,
    name: 'Dairy',
    countProducts: 2,
  });

  db.category.create({
    id: 4,
    name: 'Frozen Foods',
    countProducts: 0,
  });
}

function initializeProducts() {
  db.product.create({
    id: 1,
    name: 'Bread',
    caloriesCost: 250,
    categoryId: 1,
    categoryName: 'Bakery',
  });

  db.product.create({
    id: 2,
    name: 'Chicken',
    caloriesCost: 136,
    categoryId: 3,
    categoryName: 'Meat',
  });

  db.product.create({
    id: 3,
    name: 'Rice',
    caloriesCost: 130,
    categoryId: 2,
    categoryName: 'Cereals',
  });

  db.product.create({
    id: 4,
    name: 'Scrambled eggs',
    caloriesCost: 154,
    categoryId: 4,
    categoryName: 'Eggs',
  });
}

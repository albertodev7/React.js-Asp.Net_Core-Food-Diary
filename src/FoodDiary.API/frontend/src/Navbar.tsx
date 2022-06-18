import React from 'react';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import { AppBar, List, ListItem, ListItemText, Toolbar } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const navLinks = [
  {
    title: 'Pages',
    path: '/pages',
  },
  {
    title: 'Products',
    path: '/products',
  },
  {
    title: 'Categories',
    path: '/categories',
  },
];

const useStyles = makeStyles(theme => ({
  brand: {
    color: theme.palette.primary.contrastText,
    textDecoration: `none`,
    fontSize: theme.typography.h5.fontSize,
    fontWeight: 'bold',
    marginRight: theme.spacing(2),
  },
  navLinksContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  navLink: {
    textDecoration: `none`,
    color: theme.palette.primary.contrastText,
  },
  navLinkActive: {
    borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
  },
}));

const Navbar: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar id="back-to-top-anchor">
        <RouterLink to="/" className={classes.brand}>
          Food diary
        </RouterLink>
        <List component="nav" className={classes.navLinksContainer}>
          {navLinks.map(({ title, path }, index) => (
            <NavLink
              key={index}
              to={path}
              className={({ isActive }) =>
                classes.navLink.concat(isActive ? ` ${classes.navLinkActive}` : '')
              }
            >
              <ListItem button>
                <ListItemText primary={title}></ListItemText>
              </ListItem>
            </NavLink>
          ))}
        </List>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

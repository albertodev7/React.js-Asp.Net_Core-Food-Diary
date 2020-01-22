import React from 'react';
import './SidebarListItemLink.scss';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface SidebarListItemLinkProps extends NavLinkProps {
  selected?: boolean;
}

const SidebarListItemLink: React.FC<SidebarListItemLinkProps> = ({
  selected = false,
  children,
  className,
  ...linkProps
}: React.PropsWithChildren<SidebarListItemLinkProps>) => {
  const classNames = ['sidebar__list__item__link'];
  if (selected) {
    classNames.push('sidebar__list__item__link_selected');
  }
  return (
    <NavLink {...linkProps} className={[className, ...classNames].join(' ')}>
      {children}
    </NavLink>
  );
};

export default SidebarListItemLink;

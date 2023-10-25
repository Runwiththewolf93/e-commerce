"use client";

import { Breadcrumb, Dropdown } from "flowbite-react";
import {
  HiHome,
  HiCog,
  HiCurrencyDollar,
  HiLogout,
  HiViewGrid,
} from "react-icons/hi";

export function BreadCrumb({ category }) {
  return (
    <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item href="/" icon={HiHome}>
        <p>Home</p>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{category}</Breadcrumb.Item>
      {/* <Breadcrumb.Item>Flowbite React</Breadcrumb.Item> */}
    </Breadcrumb>
  );
}

export function DropDown() {
  return (
    <Dropdown label="Sort By" inline>
      <Dropdown.Item>Dashboard</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item>
      <Dropdown.Item>Earnings</Dropdown.Item>
      <Dropdown.Item>Sign out</Dropdown.Item>
    </Dropdown>
  );
}

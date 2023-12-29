import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function CategoryBreadcrumb({ category }) {
  return (
    <Breadcrumb aria-label="Breadcrumb category" className="ml-20">
      <Breadcrumb.Item href="/" icon={HiHome}>
        <p>Home</p>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{category}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

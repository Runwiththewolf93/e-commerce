import { Tooltip } from "flowbite-react";

const ProductTooltipStar = ({ content, children }) => {
  return <Tooltip content={content}>{children}</Tooltip>;
};

export default ProductTooltipStar;

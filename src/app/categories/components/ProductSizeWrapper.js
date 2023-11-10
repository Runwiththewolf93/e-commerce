export default function ProductSizeWrapper({ children, minHeight, minWidth }) {
  const style = {
    minHeight: minHeight || "300px",
    minWidth: minWidth || "250px",
  };

  return (
    <div style={style} className="flex flex-col justify-center items-center">
      {children}
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export { NavLink };

function NavLink({ children, href, exact, ...props }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  if (isActive) {
    props.className += " active";
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

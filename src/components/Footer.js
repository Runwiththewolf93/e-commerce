export default function Footer() {
  return (
    <footer className="bg-white h-20">
      <nav className="h-full flex justify-between items-center mx-3">
        <div>
          <span className="text-gray-600 text-2xl font-semibold">
            © 2023 E-commerce
          </span>
        </div>
        <ul className="flex items-center gap-4 text-gray-600">
          <li>
            <a href="#" className="hover:underline whitespace-nowrap">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline whitespace-nowrap">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline whitespace-nowrap">
              Licensing
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline whitespace-nowrap">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

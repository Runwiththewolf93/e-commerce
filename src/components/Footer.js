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
            <a href="#" className="hover:underline">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Licensing
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

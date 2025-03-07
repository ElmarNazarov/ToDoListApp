"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    try {
      localStorage.removeItem("userInfo");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    router.push("/auth/login");
  };

  const navLinks = [
    { name: "Главная", path: "/home" },
    { name: "Задачи", path: "/home/tasks" },
  ];

  return (
    <header className="bg-gray-900 text-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <nav className="flex space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`text-lg font-medium ${
              pathname === link.path ? "text-gray-200 font-semibold" : " hover:text-gray-200"
            } transition`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
      >
        Выход
      </button>
    </header>
  );
};

export default Header;

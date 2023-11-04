"use client";

import { useEffect, useState } from "react";
import {
  IcRoundClose,
  MaterialSymbolsKeyboardArrowDown,
  PajamasHamburger,
} from "@/icons/icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getItem } from "@/lib/utils";
import { renderAuthButtons } from "@/lib/Renders";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsAuth(false);
    getItem("token") && setIsAuth(true);
    const fetchCategories = async () => {
      const res = await fetch("https://fakestoreapi.com/products/categories");
      const data = await res.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <nav className="flex items-center justify-between shadow py-6 px-3">
      <div
        onClick={() => router.push("/")}
        className="text-2xl font-bold flex items-center gap-3 cursor-pointer"
      >
        <Image
          src="/icon.svg"
          width={32}
          height={32}
          className="md:w-12 md:h-12"
          alt="Logo"
          title="Ecommerce Site Logo"
        />
        <Link href="/" className="max-lg:hidden">
          Comm
        </Link>
      </div>
      <div className="flex items-center gap-20 font-semibold max-lg:hidden">
        <Link href="/products" className="hover:text-orange-400">
          Products
        </Link>
        <div className="">
          <div className="group inline-block relative">
            <button className="text-black font-semibold hover:text-orange-400">
              <span className="mr-1">Categories</span>
              <MaterialSymbolsKeyboardArrowDown className="w-6 h-6 inline-block" />
            </button>
            <ul className="absolute hidden bg-white text-gray-700 pt-1 group-hover:block left-[-180%] min-w-[600px]">
              <div className="bg-slate-300 grid grid-cols-3 gap-2 p-2">
                {categories.map((category, index) => {
                  return (
                    <li className="" key={index}>
                      <Link
                        className="bg-white hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap"
                        href={`/products?category=${category}`}
                      >
                        {category}
                      </Link>
                    </li>
                  );
                })}
              </div>
            </ul>
          </div>
        </div>
        <Link href="/products" className="hover:text-orange-400">
          UseFul Links
        </Link>
        <Link href="/products" className="hover:text-orange-400">
          Contact Us
        </Link>
      </div>
      <div className="flex items-center min-w-[200px] gap-5 max-lg:hidden">
        {renderAuthButtons(isAuth)}
      </div>
      <div className="lg:hidden">
        <button
          onClick={toggleMenu}
          className="focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <IcRoundClose className="w-6 h-6 hover:text-red-600" />
          ) : (
            <PajamasHamburger className="w-6 h-6 hover:text-blue-600" />
          )}
        </button>
        {isOpen && (
          <div className="absolute top-[90px] w-full left-0 right-10 bg-white z-10 py-2 shadow">
            <Link
              href="/products"
              className="block px-4 py-2 hover:bg-slate-400"
            >
              Products
            </Link>
            <Link href="/login" className="block px-4 py-2 hover:bg-slate-400">
              Login
            </Link>
            <Link
              href="/register"
              className="block px-4 py-2 hover:bg-slate-400"
            >
              Register
            </Link>
            <hr className="my-2" />
            <button className="block px-4 py-2 hover:bg-red-600 hover:text-white w-full">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-background text-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">CartCrew</span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-muted-foreground">
          © {new Date().getFullYear()} CartCrew. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

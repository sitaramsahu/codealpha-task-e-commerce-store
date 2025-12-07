// components/Footer.jsx
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        {/* Column 1 - Brand Info */}
        <div>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/readyatra-logo.png"
              width={60}
              height={40}
              alt="Readyatra Logo"
            />

            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-gray-100">
                Read<span className="text-blue-600">Yatra</span>
              </span>
              <span className="text-sm text-gray-500 italic">
                Har Kitaab, Ek Nayi Yatra
              </span>
            </div>
          </Link>
          <p className="text-sm">
            Your one-stop shop for digital and daily essentials. Trusted
            quality, affordable prices.
          </p>
          <div className="flex space-x-4 mt-4">
            <Link href="#" className="hover:text-white">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="hover:text-white">
              <Twitter size={20} />
            </Link>
            <Link href="#" className="hover:text-white">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="hover:text-white">
              <Youtube size={20} />
            </Link>
          </div>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-white">
                Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 - Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 - Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Get In Touch
          </h3>
          <div className="flex items-center space-x-2 text-sm mb-2">
            <MapPin size={18} className="text-blue-400" />
            <span>Patna, Bihar, India</span>
          </div>
          <div className="flex items-center space-x-2 text-sm mb-2">
            <Phone size={18} className="text-green-400" />
            <span>+91 9876543210</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Mail size={18} className="text-yellow-400" />
            <span>support@readyatra.com</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-semibold">ReadYatra</span>. All Rights
        Reserved.
      </div>
    </footer>
  );
};

export default Footer;

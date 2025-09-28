import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import Logo from "../Home/Logo"; // Logo import

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-5 relative overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
        {/* Branding */}
        <div>
          <Logo /> {/* Logo Component */}
          <p className="text-gray-300 mt-4">
            Connecting pets with loving homes and creating happy families.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-100">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { name: "Home", to: "/" },
              { name: "Pet Listing", to: "/pets" },
              { name: "Donation Campaigns", to: "/donations" },
              { name: "About Us", to: "/about" },
            ].map((link, index) => (
              <li key={index}>
                <Link
                  to={link.to}
                  className="hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-100">Follow Us</h3>
          <div className="flex gap-4">
            {[
              {
                icon: <FaFacebook size={24} />,
                href: "https://www.facebook.com/sondip.kumar.750",
                color: "hover:text-blue-500",
              },
              {
                icon: <FaGithub size={24} />,
                href: "https://github.com/iamsondev",
                color: "hover:text-gray-400",
              },
              {
                icon: <FaXTwitter size={24} />,
                href: "https://x.com/SonDIPX",
                color: "hover:text-white",
              },
            ].map((soc, index) => (
              <motion.a
                key={index}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3 }}
                className={`transition-all duration-300 text-gray-300 ${soc.color} p-2 rounded-full`}
              >
                {soc.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Newsletter / CTA */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-100">Stay Updated</h3>
          <p className="mb-4 text-gray-400">
            Subscribe to our newsletter for adoption updates.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="p-3 rounded-l text-black w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all shadow-inner"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-r w-auto"
            >
              <Button className="rounded-r bg-primary hover:bg-primary/90 transition-colors duration-300">
                Subscribe
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-400 text-sm relative z-10">
        © 2025 Pawlume. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

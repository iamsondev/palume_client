import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 p-5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Pawlume</h2>
          <p>Connecting pets with loving homes and creating happy families.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/pets" className="hover:text-primary transition-colors">Pet Listing</Link></li>
            <li><Link to="/donations" className="hover:text-primary transition-colors">Donation Campaigns</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/sondip.kumar.750"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://github.com/iamsondev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://x.com/SonDIPX"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaXTwitter size={24} />
            </a>
          </div>
        </div>

        {/* Newsletter / CTA */}
        <div>
          <h3 className="font-semibold mb-4">Stay Updated</h3>
          <p className="mb-4 text-gray-300">Subscribe to our newsletter for adoption updates.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 rounded-l text-black w-full"
            />
            <Button className="rounded-r bg-primary hover:bg-primary/90 transition-colors">Subscribe</Button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm transition-colors">
        © 2025 Pawlume. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

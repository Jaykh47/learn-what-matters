import Link from 'next/link';
import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 border-t border-gray-700 text-gray-400">
      <div className="max-w-6xl mx-auto py-4 px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        
        

        {/* Developer Credit */}
        <div className="text-center">
          <p>
            Made with ❤️ by{' '}
            <span className="font-semibold text-white">Jayanta Kumar</span>
          </p>
        </div>

        {/* Social Links (Optional but looks good) */}
        <div className="flex space-x-5">
          <a href="https://www.instagram.com/kumarx416/?__pwa=1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <FaInstagram size={20} />
          </a>
          <a href="https://www.linkedin.com/in/jayanta-kumar-31b4a434a" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <FaLinkedin size={20} />
          </a>
          <a href="https://www.facebook.com/Jay47kumar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <FaFacebook size={20} />
          </a>
        </div>

        {/* Copyright Notice */}
        <div className="text-center sm:text-left">
          <p>&copy; {currentYear} Learn What Matters. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
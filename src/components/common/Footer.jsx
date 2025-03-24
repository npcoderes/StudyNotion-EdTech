import React from "react";
import { Link } from "react-router-dom";

// Images
import Logo from "../../assets/Logo/Logo-Full-Light.png";

// Icons
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  const footerLinks = [
    {
      title: "Company",
      links: ["About", "Careers", "Affiliates"]
    },
    {
      title: "Resources",
      links: ["Articles", "Blog", "Documentation", "Projects", "Videos"]
    },
    {
      title: "Community",
      links: ["Forums", "Events", "Discord", "Help Center"]
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook size={22} />, url: "https://facebook.com", color: "#1877F2", hoverColor: "#4293ff" },
    { icon: <FaTwitter size={22} />, url: "https://twitter.com", color: "#1DA1F2", hoverColor: "#4db5ff" },
    { icon: <FaInstagram size={22} />, url: "https://instagram.com", color: "#E4405F", hoverColor: "#ff6b8a" },
    { icon: <FaLinkedin size={22} />, url: "https://linkedin.com", color: "#0A66C2", hoverColor: "#3d8ce0" },
    { icon: <FaGithub size={22} />, url: "https://github.com", color: "#24292E", hoverColor: "#4a5258" }
  ];

  return (
    <footer className="bg-gradient-to-br from-[#0c1220] via-[#111827] to-[#1a202c] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Social */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/">
              <img src={Logo} alt="StudyNotion Logo" className="h-10 mb-6 hover:opacity-90 transition-opacity" />
            </Link>
            <p className="text-[#E5E7EB] mb-8 leading-relaxed text-[15px]">
              Transform your career with our online coding courses. Learn at your own pace and get the skills you need for tomorrow's opportunities.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  style={{ color: social.color }}
                  onMouseOver={(e) => e.currentTarget.style.color = social.hoverColor}
                  onMouseOut={(e) => e.currentTarget.style.color = social.color}
                >
                  <div className="p-2 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="col-span-1">
              <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                {section.title}
                <span className="absolute -bottom-2 left-0 w-12 h-[3px] bg-gradient-to-r from-[#422FAF] to-[#6366F1] rounded-full"></span>
              </h3>
              <ul className="space-y-4 mt-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-[#D1D5DB] hover:text-white hover:translate-x-1 inline-flex items-center transition-all duration-300"
                    >
                      <span className="w-0 h-[2px] bg-[#422FAF] mr-0 opacity-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2 group-hover:opacity-100"></span>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-white bg-opacity-5 rounded-xl p-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Stay Updated with StudyNotion</h3>
              <p className="text-[#D1D5DB] text-sm">Subscribe to our newsletter for the latest updates and offers</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 bg-white bg-opacity-10 rounded-l-lg focus:outline-none focus:bg-opacity-15 text-white w-full md:w-64"
              />
              <button className="bg-gradient-to-r from-[#422FAF] to-[#6366F1] hover:from-[#3B27A1] hover:to-[#5558E6] text-white px-5 py-3 rounded-r-lg font-medium transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#374151] my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[#9CA3AF] text-sm">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4 md:mb-0">
            <Link to="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-white transition-colors duration-300">Cookie Policy</Link>
          </div>
          <p>© {new Date().getFullYear()} StudyNotion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
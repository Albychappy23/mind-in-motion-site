import { useState, useEffect } from "react";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#resources", label: "Resources" },
  { href: "#stories", label: "Stories" },
  { href: "#submit-story", label: "Share Story" },
  { href: "#contact", label: "Contact" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
          current = section.getAttribute("id") || "";
        }
      });

      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const handleNavClick = (href: string) => {
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center md:justify-center space-x-2 md:space-x-8 py-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`px-4 py-2 font-medium transition-colors duration-200 rounded-lg hover:bg-slate-100 ${
                activeSection === item.href.substring(1)
                  ? "text-primary bg-blue-50"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

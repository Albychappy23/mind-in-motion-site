import { Heart } from "lucide-react";

const quickLinks = [
  { href: "#resources", label: "Resources" },
  { href: "#stories", label: "Stories" },
  { href: "#submit-story", label: "Share Story" },
  { href: "#contact", label: "Contact" },
];

const crisisSupport = [
  { label: "NAMI: 1-800-950-NAMI", href: "tel:1-800-950-6264" },
  { label: "Crisis Lifeline: 988", href: "tel:988" },
  { label: "Crisis Text: 741741", href: "sms:741741" },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-primary text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Mind in Motion</h3>
            <p className="text-blue-200 mb-4">
              Supporting athletes mentally after injury through resources, community, and hope.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.522 18.96c-2.297 0-4.157-1.86-4.157-4.157s1.86-4.157 4.157-4.157 4.157 1.86 4.157 4.157-1.86 4.157-4.157 4.157zm7.975 0c-2.297 0-4.157-1.86-4.157-4.157s1.86-4.157 4.157-4.157 4.157 1.86 4.157 4.157-1.86 4.157-4.157 4.157z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-blue-200">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Crisis Support</h4>
            <ul className="space-y-2 text-blue-200">
              {crisisSupport.map((contact, index) => (
                <li key={index}>
                  <a
                    href={contact.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-700 mt-8 pt-6 text-center text-blue-200">
          <p className="flex items-center justify-center">
            &copy; 2025 Mind in Motion. Created with{" "}
            <Heart className="w-4 h-4 mx-1 text-red-400" />
            by Abhinav Chandran.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  const khakiPrimary = "#D4B483";
  const khakiLight = "#E6D5B8";
  const khakiDark = "#B5985C";
  const navyDark = "#0f172a";

  return (
    <footer 
      className="relative mt-16 border-t border-gray-800 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #1e293b 0%, #334155 100%)`
      }}
    >
      {/* Decorative background elements (kept for subtle effect) */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-khakiPrimary to-transparent"></div>
        <div className="absolute bottom-10 right-1/4 w-40 h-40 rounded-full bg-gradient-to-tr from-khakiDark to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left: Logo and Branding */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-khakiPrimary/20 to-khakiDark/20 blur-sm rounded-full"></div>
                <img 
                  src="/jhpolice.png" 
                  alt="Jharkhand Police Logo" 
                  className="h-12 w-12 md:h-14 md:w-14 relative z-10 drop-shadow-lg"
                />
              </div>
              <div className="flex flex-col">
                <h3 
                  className="text-lg md:text-xl font-bold tracking-wide"
                  style={{ color: khakiLight }}
                >
                  e-Malkhana
                </h3>
                <span className="text-xs text-gray-400 tracking-widest uppercase">
                  Jharkhand Police
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 text-center md:text-left max-w-xs">
              Securing justice through systematic evidence management
            </p>
          </div>

          {/* Center: Copyright and Description */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <svg 
                className="w-4 h-4" 
                style={{ color: khakiPrimary }}
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                Official Platform
              </span>
            </div>
            
            <p className="text-sm md:text-base">
              © {new Date().getFullYear()} Digital e-Malkhana System
            </p>
            
            <p 
              className="text-sm text-gray-300 font-medium"
              style={{ color: khakiLight }}
            >
              Police Evidence Management Platform
            </p>
          </div>

          {/* Right: Contact/Additional Info */}
          <div className="text-center md:text-right space-y-4">
            <div className="inline-flex flex-col items-center md:items-end gap-2 p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700">
              <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                24/7 Support
              </h4>
              <p className="text-sm font-medium">emergency@jhpolice.gov.in</p>
              <p className="text-xs text-gray-400">+91 XXX XXX XXXX</p>
            </div>
            
            <p className="text-xs text-gray-500">
              Version 2.1.0 • Secure & Encrypted
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                System Status: <span className="text-green-400 font-medium">Operational</span>
              </span>
              <span className="hidden md:inline">•</span>
              <span>Last Updated: Today</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Documentation
              </a>
            </div>
          </div>
        </div>

        {/* Mobile-only bottom info */}
        <div className="mt-6 md:hidden">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              Operational
            </span>
            <span>•</span>
            <span>Secure Connection</span>
            <span>•</span>
            <span>v2.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
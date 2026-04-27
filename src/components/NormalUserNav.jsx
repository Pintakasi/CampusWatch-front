const NormalUserNav = () => {
  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'File a Complaint', href: '#', active: true },
    { name: 'FAQ', href: '#' },
    { name: 'Tracking', href: '#' },
    { name: 'Login', href: '#' },
  ];

  return (
    <nav className="flex items-center justify-between px-12 py-4 bg-white border-b border-gray-200">
      {/* Left Side: Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center">
          {/* Replace with your actual CHED logo path */}
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Commission_on_Higher_Education_%28CHED%29.svg/1200px-Commission_on_Higher_Education_%28CHED%29.svg.png" 
            alt="CHED Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            File a Complaint
          </h1>
        </div>
      </div>

      {/* Right Side: Navigation Links */}
      <div className="flex items-center space-x-2">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
              link.active
                ? 'bg-gray-100 text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default NormalUserNav;
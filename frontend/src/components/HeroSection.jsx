export default function HeroSection() {
    return (
      <div className="relative min-h-[90vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* Glassmorphism Card */}
          <div className="bg-white/40 backdrop-blur-lg shadow-xl rounded-2xl p-10 border border-gray-200">
            <h1 className="text-5xl font-extrabold text-gray-900">
            Welcome to AuthMaster
            </h1>
            <p className="text-lg text-gray-600 mt-4">
            Secure and seamless authentication for your web applications. Sign up to get started or log in to continue.
            </p>
  
            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-lg shadow-lg transition">
                Get Started
              </button>
              <button className="px-6 py-3 border border-gray-300 hover:border-gray-500 text-gray-900 text-lg rounded-lg shadow-lg transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
  
        {/* Decorative Circles */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500 rounded-full blur-xl opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-xl opacity-20"></div>
      </div>
    );
  }
  
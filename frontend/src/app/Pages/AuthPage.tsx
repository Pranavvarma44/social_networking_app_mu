import { useState } from 'react';

interface AuthPageProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export default function AuthPage({ isAuthenticated, setIsAuthenticated }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h1 className="text-white text-sm mb-1 flex items-center gap-2">
              <span className="text-2xl">📱</span> MU SOCIAL.
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-white text-4xl mb-3">Login to your account</h2>
            <p className="text-gray-400">Enter your email below to login to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-white block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757]"
              />
            </div>

            <div>
              <label className="text-white block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5757]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Login
            </button>

            <p className="text-center text-gray-400">
              Don't have an account? <a href="#" className="text-white underline">Sign up</a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-8 flex items-center justify-center">
            <div className="relative">
              <div className="text-[200px] text-[#ff5757] leading-none font-bold">M</div>
              <div className="absolute top-0 right-0 text-[200px] text-[#ff5757] leading-none font-bold opacity-80">U</div>
            </div>
          </div>
          <h1 className="text-white text-5xl">MU Social</h1>
        </div>
      </div>
    </div>
  );
}

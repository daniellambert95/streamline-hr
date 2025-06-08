import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../domains/auth/context/AuthContext';
import handleApiError from '../../core/utils/handleApiError';
import { authService } from '../../domains/auth/services/auth';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await authService.login(form);
      const { token, user } = data;
      
      if (!token || !user?.id) {
        throw new Error('Invalid server response');
      }

      login(token, user);
      navigate('/dashboard');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-primary/5 via-neutral-white to-primary/10 pt-20 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 top-0">
        {/* Gradient orbs */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-48 md:w-64 lg:w-72 h-32 sm:h-48 md:h-64 lg:h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 md:right-20 w-40 sm:w-64 md:w-80 lg:w-96 h-40 sm:h-64 md:h-80 lg:h-96 bg-secondary-lavender/40 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-accent-blue/30 rounded-full blur-3xl animate-float-slow"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(87,41,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(87,41,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:30px_30px] md:bg-[size:40px_40px] lg:bg-[size:50px_50px]"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 bg-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-secondary-lavender/60 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 bg-primary/30 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-2/3 right-1/3 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-accent-blue/50 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative flex items-center justify-center min-h-[calc(100vh-5rem)] z-10">
        {/* Main Card with Glass Morphism */}
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto pt-10">
          <div className="bg-neutral-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-primary/20 relative overflow-hidden">
            
            {/* Header Section */}
            <div className="text-center mb-6 sm:mb-8">
              
              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-header text-neutral-dark mb-2 leading-tight">
                Sign in to <span className="text-primary font-header">StreamlineHR</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Access your AI-powered HR management platform
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="input-field h-11 sm:h-12 text-sm sm:text-base bg-neutral-white/80 backdrop-blur-sm border-neutral-medium/30 focus:border-primary/50 focus:bg-neutral-white transition-all duration-300"
                />
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="input-field h-11 sm:h-12 text-sm sm:text-base bg-neutral-white/80 backdrop-blur-sm border-neutral-medium/30 focus:border-primary/50 focus:bg-neutral-white transition-all duration-300"
                />
                <div className="text-right mt-2">
                  <a 
                    href="#" 
                    className="text-sm text-primary hover:text-primary-600 transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                className="group w-full bg-gradient-to-r from-primary to-purple-800 text-white h-11 sm:h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm sm:text-base transform hover:scale-[1.02] hover:-translate-y-0.5 mt-6"
              >
                <span className="flex items-center justify-center">
                  Sign In
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-5 sm:my-6">
              <div className="flex-1 border-t border-neutral-medium/30"></div>
              <div className="px-3 sm:px-4 text-xs sm:text-sm text-gray-500 bg-neutral-white/50 rounded-full">or</div>
              <div className="flex-1 border-t border-neutral-medium/30"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-neutral-white/70 backdrop-blur-sm text-neutral-dark border border-neutral-medium/30 h-11 sm:h-12 rounded-xl shadow-sm hover:shadow-md hover:bg-neutral-white/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-medium text-sm sm:text-base"
            >
              <img
                src="https://static.vecteezy.com/system/resources/previews/013/948/549/non_2x/google-logo-on-transparent-white-background-free-vector.jpg"
                alt="Google Icon"
                className="w-4 sm:w-5 h-4 sm:h-5"
              />
              Continue with Google
            </button>

            {/* Footer Links */}
            <div className="text-center mt-5 sm:mt-6 space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-primary font-semibold hover:text-primary-600 transition-colors duration-200"
                >
                  Sign up for free
                </Link>
              </p>
              
              {/* Security Badge */}
              <div className="flex items-center justify-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-neutral-medium/20">
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-3 sm:w-4 h-3 sm:h-4 text-accent-green mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="hidden sm:inline">Secured with enterprise-grade encryption</span>
                  <span className="sm:hidden">Secure & encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
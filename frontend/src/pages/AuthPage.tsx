import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import carImage from "../assets/car-image.jpg";
import { loginUser, signupUser } from "../services/api";
import axios, { AxiosError } from "axios";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("mode") === "signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.search]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPwd: "",
  });
  const [touched, setTouched] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", password: "", confirmPwd: "" });
    setTouched(false);
    setShowPwd(false);
    setShowConfirmPwd(false);
  };

  const handleSwitch = (login: boolean, email?: string, password?: string) => {
    setIsLogin(login);
    resetForm();
    // Pre-fill login credentials if provided
    if (email && password) {
      setForm(prev => ({ ...prev, email, password }));
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field === "phone") value = value.replace(/\D/g, ""); // digits only
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const { name, phone, email, password, confirmPwd } = form;
    const emailInvalid = !emailRegex.test(email);
    const passwordInvalid = password.length < 6;
    const confirmInvalid = !isLogin && confirmPwd !== password;
    const phoneInvalid = !isLogin && !phone;

    if (isLogin) {
      if (emailInvalid || passwordInvalid) return;

      try {
        const res = await loginUser({ email, password });
        if (res.data && res.data.token) {
          localStorage.setItem("token", res.data.token);
          navigate("/cars");
        }
        console.log("Login Success", res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError;
          const errorMsg =
            axiosErr.response?.data &&
              typeof axiosErr.response.data === "object" &&
              "message" in axiosErr.response.data
              ? (axiosErr.response.data as { message?: string }).message
              : undefined;
          console.error("Login Error", errorMsg || axiosErr.message);
        } else if (err instanceof Error) {
          console.error("Login Error", err.message);
        } else {
          console.error("Login Error", err);
        }
      }
    } else {
      if (!name || emailInvalid || passwordInvalid || confirmInvalid || phoneInvalid) return;

      try {
        const res = await signupUser({ name, phone, email, password });
        console.log("Signup Success", res.data);

        // Switch to login mode and pre-fill email & password
        handleSwitch(true, email, password);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError;
          const errorMsg =
            axiosErr.response?.data &&
              typeof axiosErr.response.data === "object" &&
              "message" in axiosErr.response.data
              ? (axiosErr.response.data as { message?: string }).message
              : undefined;
          console.error("Signup Error", errorMsg || axiosErr.message);
        } else if (err instanceof Error) {
          console.error("Signup Error", err.message);
        } else {
          console.error("Signup Error", err);
        }
      }
    }
  };

  const formVariants = { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 } };

  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-gradient-to-br from-[#f3e8ff] via-[#ede9fe] to-[#f5f3ff]">
      <Header />
      <div className="h-10 md:h-16 lg:h-20" />
      <main className="flex-grow flex items-center justify-center px-2 md:px-6 py-6">
        <motion.div className="relative w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden z-10">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/80 via-indigo-600/60 to-fuchsia-600/70 pointer-events-none" />
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)] pointer-events-none" />
          <div className="relative z-20 grid md:grid-cols-2 gap-0">
            {/* Form Section */}
            <div className="relative flex flex-col px-6 sm:px-10 py-10 md:py-14 bg-white/95 backdrop-blur-sm">
              <div className="max-w-lg mx-auto w-full">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                  {isLogin ? "Hello!" : "Join Us!"}
                </h1>
                <p className="text-gray-500 mb-8 font-medium">
                  {isLogin ? "Sign in to your account" : "Create your account"}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? "login" : "signup"}
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-5 max-w-sm">
                      {!isLogin && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500" size={18} />
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={form.name}
                              onChange={e => handleChange("name", e.target.value)}
                              className={`w-full pl-10 pr-3 py-3 rounded-full shadow-sm outline-none transition ring-1 ${touched && !form.name ? "ring-red-400" : "ring-violet-200 focus:ring-violet-500"
                                }`}
                            />
                          </div>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500" size={18} />
                            <input
                              type="tel"
                              placeholder="+92 300 1234567"
                              value={form.phone}
                              onChange={e => handleChange("phone", e.target.value)}
                              className={`w-full pl-10 pr-3 py-3 rounded-full shadow-sm outline-none transition ring-1 ${touched && !form.phone ? "ring-red-400" : "ring-violet-200 focus:ring-violet-500"
                                }`}
                            />
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500" size={18} />
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={e => handleChange("email", e.target.value)}
                          className={`w-full pl-10 pr-3 py-3 rounded-full shadow-sm outline-none transition ring-1 ${touched && !emailRegex.test(form.email) ? "ring-red-400" : "ring-violet-200 focus:ring-violet-500"
                            }`}
                        />
                        {touched && !emailRegex.test(form.email) && <p className="text-xs text-red-500">Enter a valid email.</p>}
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500" size={18} />
                        <input
                          type={showPwd ? "text" : "password"}
                          placeholder="••••••••"
                          value={form.password}
                          onChange={e => handleChange("password", e.target.value)}
                          className={`w-full pl-10 pr-10 py-3 rounded-full shadow-sm outline-none transition ring-1 ${touched && form.password.length < 6 ? "ring-red-400" : "ring-violet-200 focus:ring-violet-500"
                            }`}
                        />
                        <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-500">
                          {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {touched && form.password.length < 6 && <p className="text-xs text-red-500">Min 6 characters.</p>}
                      </div>

                      {!isLogin && (
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500" size={18} />
                          <input
                            type={showConfirmPwd ? "text" : "password"}
                            placeholder="••••••••"
                            value={form.confirmPwd}
                            onChange={e => handleChange("confirmPwd", e.target.value)}
                            className={`w-full pl-10 pr-10 py-3 rounded-full shadow-sm outline-none transition ring-1 ${touched && form.confirmPwd !== form.password ? "ring-red-400" : "ring-violet-200 focus:ring-violet-500"
                              }`}
                          />
                          <button type="button" onClick={() => setShowConfirmPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-500">
                            {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          {touched && form.confirmPwd !== form.password && <p className="text-xs text-red-500">Passwords do not match.</p>}
                        </div>
                      )}

                      <button
                        type="submit"
                        className={`w-full py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold transition transform hover:scale-105 hover:shadow-lg focus:outline-none cursor-pointer`}
                      >
                        {isLogin ? "Sign In" : "Create Account"}
                      </button>


                    </form>
                  </motion.div>
                </AnimatePresence>

                <p className="text-center text-sm mt-6">
                  {isLogin ? (
                    <>
                      Don’t have an account?{" "}
                      <button onClick={() => handleSwitch(false)} className="text-violet-600 font-semibold hover:underline cursor-pointer">
                        Create
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button onClick={() => handleSwitch(true)} className="text-violet-600 font-semibold hover:underline cursor-pointer">
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative flex flex-col items-center justify-center p-6 sm:p-8 text-white bg-gradient-to-tr from-violet-600/30 via-indigo-600/30 to-fuchsia-600/30">
              <div className="w-full max-w-md mx-auto text-center space-y-6">
                <div className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/20">
                  <img src={carImage} alt="Car showcase" className="w-full h-44 object-cover md:h-52 lg:h-60" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 via-transparent to-indigo-600/30 pointer-events-none" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-semibold mb-4 drop-shadow-lg">{isLogin ? "Welcome Back!" : "Welcome Aboard!"}</h2>
                  <p className="text-base sm:text-lg leading-relaxed text-white/90">
                    {isLogin
                      ? "Access your account to explore and manage car listings."
                      : "Join us today! Create your account to browse, search, and list cars."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
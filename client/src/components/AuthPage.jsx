import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: ""
  });
  const [error, setError] = useState("");
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/welcome");
  }, [user]);

  // Password strength logic
  const passwordChecks = {
    length: form.password.length >= 6,
    letter: /[a-zA-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    symbol: /[^a-zA-Z0-9]/.test(form.password)
  };
  const passwordPassedCount = Object.values(passwordChecks).filter(Boolean).length;
  const passwordPercent = (passwordPassedCount / 4) * 100;

  const allValid = form.email && form.password && (isLogin || (
    form.name &&
    form.phone &&
    form.password === form.confirmPassword &&
    passwordPassedCount === 4
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const res = await login(form.email, form.password);
        loginUser(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        navigate("/welcome");
      } else {
        await signup(form);
        toast.success("Account created successfully! Please login.");
        setIsLogin(true);
        setForm({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? "Login to EasyInvoice" : "Create Your Account"}
        </h2>

        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "signup"}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {!isLogin && (
              <>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                />
              </>
            )}
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />

            {!isLogin && (
              <>
                <input
                  type="password"
                  required
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                />
                <div className="h-2 w-full bg-gray-300 rounded overflow-hidden">
                  <div
                    style={{ width: `${passwordPercent}%` }}
                    className={`h-full transition-all duration-300 
                      ${passwordPercent === 100 ? "bg-green-600" : "bg-yellow-500"}`}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  Password strength: {passwordPassedCount}/4 checks
                </p>
              </>
            )}

            <button
              type="submit"
              disabled={!allValid}
              className={`w-full py-2 rounded text-white font-semibold transition
                ${allValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </motion.form>
        </AnimatePresence>

        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-green-600 hover:underline"
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

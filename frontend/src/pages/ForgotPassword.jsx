import { API } from "@/api/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let regex = /^[a-zA-Z0-9_.+\-]+[\x40][a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    const isValid = regex.test(email);
    if (!isValid) {
      toast.error("Email is not valid");
      return;
    }
    try {
      setIsLoading(true);
      const response = await API.post("/sendEmailToResetPassword", { email });
      setSuccess(response.data.success);
    } catch (error) {
      toast.error(error.response?.data.message || error.message);
    } finally {
      setIsLoading(false);
      setEmail("");
    }
    // Simulate API request
    setTimeout(() => {
      setMessage(
        "If an account with this email exists, you will receive a password reset link."
      );
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Forgot Password
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Enter your email address below and we'll send you a link to reset your
          password.
        </p>
        {message && (
          <p className="text-green-600 text-sm text-center mb-4">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded-md bg-gray-50 border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          {success ? (
            <button
            onClick={()=>navigate('/login')}
              type="submit"
              className="w-full py-2 px-4 bg-[#21cbca] text-white hover:bg-[#1db1b1] rounded-md transition-all duration-200"
            >Go to login page</button>
          ) : (
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#21cbca] text-white hover:bg-[#1db1b1] rounded-md transition-all duration-200"
            >
              {isLoading ? " ... " : "Send Reset Link"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

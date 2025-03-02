import { API } from "@/api/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {  
    try {
      setIsLoading(true);
      const response = await API.post(`/resetPassword/${token}`, data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data.message || error.message);
    } finally {
      navigate("/login");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Enter your new password below.
        </p>
        {message && (
          <p className="text-green-600 text-sm text-center mb-4">{message}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full p-2 border rounded-md bg-gray-50 border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="Enter new password"
              {...register("password", {
                required: "Password is requird",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              required
              className="mt-1 w-full p-2 border rounded-md bg-gray-50 border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="Confirm new password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
          </div>
          {errors.password ? (
            <p className="text-red-500">{errors.password.message}</p>
          ) : errors.confirmPassword ? (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          ) : (
            ""
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#21CBCA] text-white hover:bg-[#1db1b1] rounded-md transition-all duration-200"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

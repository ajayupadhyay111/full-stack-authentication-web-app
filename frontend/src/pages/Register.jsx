import { useState } from "react";
import user from "../assets/user.png";
import { FaEyeSlash, FaEye, FaLock, FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerUser } from "@/api/api";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
const Register = () => {
  const [focusField, setFocusField] = useState(null);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await registerUser(data);
      toast.success(response.data.message);
      navigate(`/verify-email/${response.data.emailVerificationToken}`);
    } catch (error) {
      toast(error?.response?.data.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="w-screen h-screen flex justify-center items-center"
      onClick={() => {
        setFocusField(null);
      }}
    >
      <div className="w-[500px] shadow-2xl h-[500px] flex justify-center flex-col items-center">
        <img src={user} alt="user" className="w-24 h-24" />
        <h1 className="font-semibold uppercase text-4xl">Welcome</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=""
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`relative h-[65px] w-[270px] ${
              focusField === "username"
                ? "border-b-[2px] border-[#21CBCA]"
                : "border-b-[1px]  border-gray-700"
            }`}
          >
            <div className="absolute bottom-0 z-10 flex justify-center items-center gap-3 px-2 py-1">
              <FaUserAlt
                className={`${
                  focusField === "username" ? "text-[#21CBCA]" : "text-gray-700"
                } transition-all duration-100`}
              />
              <input
                type="text"
                className="outline-none p-1 text-gray-800 font-semibold"
                readOnly={focusField === "username" ? false : true}
                onFocus={() => setFocusField("username")}
                onBlur={() => setFocusField(null)}
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
              />
            </div>
          </div>
          <div
            className={`relative h-[65px] ${
              focusField === "email"
                ? "border-b-[2px] border-[#21CBCA]"
                : "border-b-[1px]  border-gray-700"
            }`}
          >
            <div className="absolute bottom-0 z-10 flex justify-center items-center gap-3 px-2 py-1">
              <MdEmail
                className={`${
                  focusField === "email" ? "text-[#21CBCA]" : "text-gray-700"
                } transition-all duration-100`}
              />
              <input
                type="email"
                className="outline-none p-1 text-gray-800 font-semibold"
                readOnly={focusField === "email" ? false : true}
                onFocus={() => setFocusField("email")}
                onBlur={() => setFocusField(null)}
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: /^\S+@\S+$/i,
                })}
              />
            </div>
          </div>

          <div
            className={`relative h-[65px] ${
              focusField === "password"
                ? "border-b-[2px] border-[#21CBCA]"
                : "border-b-[1px]  border-gray-700"
            }`}
          >
            <div className="absolute bottom-0 z-10 flex justify-center items-center gap-3 px-2 py-1">
              <FaLock
                className={`${
                  focusField === "password" ? "text-[#21CBCA]" : "text-gray-700"
                } transition-all duration-100`}
              />
              <input
                type={passwordHidden ? "password" : "text"}
                className="outline-none p-1 text-gray-800 font-semibold"
                readOnly={focusField === "password" ? false : true}
                onFocus={() => setFocusField("password")}
                onBlur={() => setFocusField(null)}
                placeholder="Password"
                {...register("password", {
                  required: "Password is requird",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {passwordHidden ? (
                <FaEyeSlash
                  onClick={() => setPasswordHidden((prev) => !prev)}
                  className={`transition-all duration-100`}
                />
              ) : (
                <FaEye onClick={() => setPasswordHidden((prev) => !prev)} />
              )}
            </div>
          </div>
          {errors.username ? (
            <p className="text-red-500">{errors.username.message}</p>
          ) : errors.email ? (
            <p className="text-red-500">{errors.email.message}</p>
          ) : errors.password ? (
            <p className="text-red-500">{errors.password.message}</p>
          ) : (
            ""
          )}
          <button
            disabled={isLoading ? true : false}
            type="submit"
            className="w-[270px] mt-5 bg-[#21cbca] text-white border-none px-3 py-2 rounded-lg font-semibold"
          >
            {isLoading ? "signing..." : "Sign Up"}
          </button>
          <p className=" text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Signin
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

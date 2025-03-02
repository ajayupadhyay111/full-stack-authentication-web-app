import { useContext, useState } from "react";
import user from "../assets/user.png";
import { FaEyeSlash, FaEye, FaLock, FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { login } from "@/api/api";
import { AuthContext } from "@/context/authContext.js";
const Login = () => {
  const [focusField, setFocusField] = useState(null);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await login(data);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setUser(response.data.user);
      toast.success(response?.data.message);
      navigate("/");
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
      <div className="w-[500px] shadow-2xl h-[450px] flex justify-center flex-col items-center">
        <img src={user} alt="user" className="w-24 h-24" />
        <h1 className="font-semibold uppercase text-4xl">Welcome</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=""
          onClick={(e) => e.stopPropagation()}
        >
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
                required
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
                required
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
          {errors.email ? (
            <p className="text-red-500">{errors.email.message}</p>
          ) : errors.password ? (
            <p className="text-red-500">{errors.password.message}</p>
          ) : (
            ""
          )}
          <div className="w-[270px] flex justify-end mt-1 underline ">
            <Link to={"/forgot-password"} className="active:text-blue-500">
              Forgot Password
            </Link>
          </div>
          <button
            type="submit"
            className="w-[270px] mt-3 text-white bg-[#21cbca] border-none px-3 py-2 rounded-lg font-semibold"
          >
            Sign In
          </button>
          <p className=" text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

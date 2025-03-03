import { useContext, useState } from "react";
import user from "../assets/user.png";
import { FaEyeSlash, FaEye, FaLock, FaUserAlt, FaGoogle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { googleAuth, login } from "@/api/api";
import { AuthContext } from "@/context/authContext.js";
import GoogleIcon from "../assets/google.svg";
import FacebookIcon from "../assets/facebook.svg";
import LinkedInIcon from "../assets/linkedin.svg";
import { useGoogleLogin } from "@react-oauth/google";

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
  const { setUser, setAccessToken } = useContext(AuthContext);
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await login(data);
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      toast.success(response?.data.message);
      navigate("/");
    } catch (error) {
      toast(error?.response?.data.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // google login functionality is written below
  const responseGoogle = async (authResult) => {
    try {
      const response = await googleAuth(authResult.code);
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      navigate("/");
    } catch (error) {
      console.log("error while requesting google code ", error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <div
      className="w-screen h-screen flex justify-center items-center"
      onClick={() => {
        setFocusField(null);
      }}
    >
      <div className="w-[500px] shadow-2xl h-[470px] flex justify-center flex-col items-center">
        <img src={user} alt="user" className="w-24 h-24 mt-5" />
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
        <div className="relative w-1/2 mt-5">
          <hr />
          <span className="absolute -top-[10px] left-[46%] text-gray-500 bg-white text-sm">
            OR
          </span>
        </div>
        <div className="flex gap-9 my-5">
          <span>
            <img src={FacebookIcon} alt="" />
          </span>
          <span  onClick={googleLogin}>
            <img src={GoogleIcon} alt="" />
          </span>
          <span>
            <img src={LinkedInIcon} alt="" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;

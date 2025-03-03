import { API } from "@/api/api";
import { AuthContext } from "@/context/authContext";
import { useState, useRef, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function VerifyEmail() {
  const {token} = useParams();
  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const {setUser} = useContext(AuthContext)
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  // Handle input change
  const handleChange = (index, e) => {
    const value = e.target.value;

    if (!/^\d$/.test(value)) return; // Allow only digits (0-9)

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if available
    if (index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = ""; // Clear current input
      } else if (index > 0) {
        inputRefs.current[index - 1].focus(); // Move focus back
        newOtp[index - 1] = ""; // Clear previous input
      }

      setOtp(newOtp);
    }
  };
  const handleSubmit = async() => {
    let OTP = otp.join("");
    try {
      const response = await API.post(`/verify-email/${token}`,{OTP});
      setUser(prev=>({...prev,isVerified:true}))
      navigate("/login")
      toast.success(response.data.message);
      localStorage.removeItem("emailVerificationToken")
    } catch (error) {
     toast.error(error?.response?.data.message||error.message)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-900">
      <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
      <p className="mb-6 text-gray-800">
        We have sent a 6-digit OTP to your email
      </p>

      <div className="flex gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="text-black w-12 h-12 text-xl text-center border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-[#21cbca] text-white rounded hover:bg-[#1db8b8] transition"
      >
        Verify OTP
      </button>
    </div>
  );
}

import { LogOut, Mail, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "./ui/avatar";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { API } from "@/api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { MdDashboard } from "react-icons/md";

const Navbar = () => {
  const { user,accessToken,setAccessToken,setUser } = useContext(AuthContext);
  const [name, setName] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const sendOtpToRegisterEmail = async () => {
    try {
      setIsVerifying(true);
      const response = await API.post("/sendOTP", {},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      toast.success(response.data.message);
      navigate(`/verify-email/${response.data.emailVerificationToken}`);
    } catch (error) {
      toast.error(error?.response?.data.message || error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogoutAccount = async () => {
    try {
      setIsLoading("logout");
      const response = await API.post("/logout", {},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      toast.success(response.data.message);
      setUser(null);
      setAccessToken(null)
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data.message || error.message);
    }finally{
      setIsLoading("")
    }
  };
  const handleDeleteAccount = async () => {
    try {
      setIsLoading("delete");
      const response = await API.delete("/deleteAccount",{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      toast.success(response.data.message);
      setUser(null)
      setAccessToken(null)
      navigate("/register");
    } catch (error) {
      toast.error(error.response?.data.message || error.message);
    }
  };

  return (
    <nav className=" h-[70px] overflow- w-full z-20 bg-white shadow-md flex justify-between items-center px-5 py-3">
      <h1 className="font-bold text-xl">Logo</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="flex justify-center items-center border-2">
            <span className="text-lg font-semibold text-gray-800">
              {user?.name?.at(0).toUpperCase()}
            </span>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          {user?.isVerified ? (
            <></>
          ) : (
            <Dialog open={isVerifying} onOpenChange={setIsVerifying}>
              <DialogTrigger asChild>
                <button
                  onClick={sendOtpToRegisterEmail}
                  className="border-none px-[8px] flex items-center gap-2 py-1 hover:bg-gray-100 w-full rounded-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Verify email</span>
                </button>
              </DialogTrigger>
              <DialogContent className="w-screen h-screen bg-transparent border-none">
                {/* Hide Close Button using CSS */}
                <style>
                  {`.absolute.right-4.top-4 { display: none !important; }`}
                </style>
                <div className="flex justify-center items-center h-screen">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {user?.isVerified ? "" : <DropdownMenuSeparator />}
          {user?.isVerified && user?.role === "admin" ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="border-none px-[6px] flex items-center gap-2 py-1 hover:bg-gray-100 w-full rounded-sm"
            >
              <MdDashboard className="w-4 h-4" />
              Dashboard
            </button>
          ) : (
            <></>
          )}
          {user?.role === "admin" ? <DropdownMenuSeparator /> : <></>}
          <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <DialogTrigger asChild>
              <button
                onClick={() => setOpenDeleteDialog(true)}
                className="border-none px-[6px] flex items-center gap-2 py-1 hover:bg-gray-100 w-full rounded-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete account?
                </DialogTitle>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setOpenDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isLoading === "delete" ? true : false}
                  variant="destructive"
                  onClick={handleDeleteAccount}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <DropdownMenuSeparator />

          <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
            <DialogTrigger asChild>
              <button
                onClick={() => setOpenLogoutDialog(true)}
                className="border-none px-[8px] flex items-center gap-2 py-1 hover:bg-gray-100 w-full rounded-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Are you sure you want to Logout?</DialogTitle>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setOpenLogoutDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isLoading === "logout" ? true : false}
                  variant="destructive"
                  onClick={handleLogoutAccount}
                >
                  Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Navbar;

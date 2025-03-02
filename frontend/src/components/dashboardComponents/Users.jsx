import { API } from "@/api/api";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";



const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    isVerified: "false",
  });
  

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await API.get("/getAllUsers");
        setUsers(response.data.users);
      } catch (error) {
        toast.error(error.response?.data.message || error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setUsers]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleEdit = async (e, USER) => {
    e.preventDefault();
    try {
      const response = await API.put(`/admin/editUser/${USER._id}`, formData);
      if (response.data.success) {
        setUsers(users.map((user) => (user._id === USER._id ? formData : user)))
      }
    } catch (error) {
      toast.error(error.response?.data.message || error.message);
    }
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user._id !== id));
  };
  return (
    <>
      {isLoading ? (
        <Dialog open={isLoading} onOpenChange={setIsLoading}>
          <DialogContent className="w-screen h-screen bg-transparent border-none">
            {/* Hide Close Button using CSS */}
            <DialogTitle></DialogTitle>
            <style>{`.absolute.right-4.top-4 { display: none !important; }`}</style>
            <div className="flex justify-center items-center h-screen">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="p-2 bg-white">
          <h2 className="text-2xl font-semibold mb-4">User List</h2>
          <div className="overflow-x-auto">
            <div className="w-[calc(100vw-80px)] lg:w-[calc(100vw-300px)] max-h-[calc(100vh-160px)] overflow-y-auto overflow-x-auto border border-gray-300 rounded-md scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="border p-3 text-left">Name</th>
                    <th className="border p-3 text-left">Email</th>
                    <th className="border p-3 text-left">Role</th>
                    <th className="border p-3 text-left">Verified</th>
                    <th className="border p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="border p-3">{user.name}</td>
                      <td className="border p-3">{user.email}</td>
                      <td className="border p-3">{user.role}</td>
                      <td className="border p-3">
                        {user.isVerified ? "✅ Yes" : "❌ No"}
                      </td>
                      <td className="border p-3">
                        <div className="flex gap-2 justify-center items-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Pencil
                                className="text-blue-500"
                                onClick={() => setFormData(user)}
                              />
                            </DialogTrigger>
                            <DialogContent className="p-6">
                              <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                              </DialogHeader>

                              <form
                                onSubmit={(e) => handleEdit(e, user)}
                                className="space-y-4"
                              >
                                <div>
                                  <Label>Name</Label>
                                  <Input
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.name}
                                    onChange={(e) =>
                                      handleChange("name", e.target.value)
                                    }
                                    required
                                  />
                                </div>

                                <div>
                                  <Label>Email</Label>
                                  <Input
                                    type="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={(e) =>
                                      handleChange("email", e.target.value)
                                    }
                                    required
                                  />
                                </div>

                                <div>
                                  <Label>Role</Label>
                                  <Select
                                    onValueChange={(value) =>
                                      handleChange("role", value)
                                    }
                                    defaultValue={formData.role}
                                  >
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={formData.role}
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="admin">
                                        Admin
                                      </SelectItem>
                                      <SelectItem value="user">User</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label>Is Verified?</Label>
                                  <Select
                                    onValueChange={(value) =>
                                      handleChange("isVerified", value)
                                    }
                                    defaultValue={formData.isVerified}
                                  >
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={formData.isVerified}
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="true">Yes</SelectItem>
                                      <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <DialogFooter>
                                  <DialogClose>
                                  <Button type="submit">Submit</Button>
                                  </DialogClose>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Trash className="text-red-500" />
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>
                                  Are you sure you want to delete{" "}
                                  <i> {user.name}</i> account?
                                </DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-end space-x-2">
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(user._id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;

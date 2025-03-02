import User from "../models/user.model.js";

export const editUserById = async (request, response, next) => {
  try {
    const { id } = request.params;
    const { name, email, role, isVerified } = request.body;

    const user = await User.findById(id);
    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.role = role;
    user.isVerified = isVerified;
    await user.save();

    response.status(200).json({success:true, message: "User updated" });
  } catch (error) {
    next(error);
  }
};
export const deleteUserById = async (request, response, next) => {
  try {
    const { id } = request.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    response.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

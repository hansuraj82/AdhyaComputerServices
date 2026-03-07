import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";


export const loginStaff = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });

    if (!user.isActive) {
        return res.status(403).json({
            message: "Your account has been deactivated by the Head Authority"
        });
    }

    if (!user || !(await user.matchPassword(password))) {
        return res.status(403).json({ message: "Invalid credentials" });
    }

    res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id)
    });
});

export const getStaff = async (req, res) => {

    const staff = await User.find({ role: "staff" })
        .select("-password")
        .sort({ createdAt: -1 });

    res.json(staff);
};


export const createStaff = asyncHandler(async (req, res) => {
    // 1. Destructure email correctly
    const { name, mobile, aadhar, email,password } = req.body; 

    // 2. Check if exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const staff = await User.create({ name, mobile, aadhar, email, password, role: "staff" });
    res.status(201).json({message: 'staff created successfully!'});
});

export const deleteStaff = asyncHandler(async (req, res) => {
    const staff = await User.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    // 3. Use lowercase comparison
    if (staff.role.toLowerCase() !== "staff") {
        return res.status(400).json({ message: "Cannot delete owner" });
    }

    await staff.deleteOne();
    res.json({ message: "Staff deleted successfully" });
});




export const toggleStaff = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id);

  if (!staff) {
    const error = new Error("staff not found");
    error.statusCode = 404;
    throw error;
  }

  staff.isActive = !staff.isActive;
  await staff.save();

  res.json({    
    message: "staff Toggled successfully"
  });
});
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import OTP from "../models/otp.model.js";
import cloudinary from "../utils/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all conversations the user is part of and sort by most recently updated
        const conversations = await Conversation.find({
            participants: { $in: [loggedInUserId] }
        }).sort({ updatedAt: -1 }).populate('participants', '-password');

        const sortedUsers = [];
        const seenUserIds = new Set();
        seenUserIds.add(loggedInUserId.toString());

        conversations.forEach(conv => {
            conv.participants.forEach(participant => {
                if (!seenUserIds.has(participant._id.toString())) {
                    sortedUsers.push(participant);
                    seenUserIds.add(participant._id.toString());
                }
            });
        });

        // Find remaining users the user hasn't chatted with yet
        const remainingUsers = await User.find({
            _id: { $nin: Array.from(seenUserIds) }
        }).select("-password");

        const allUsers = [...sortedUsers, ...remainingUsers];

        res.status(200).json(allUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller ", error.message);
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, profilePic, email } = req.body;
        const userId = req.user._id;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (fullName) {
            user.fullName = fullName;
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "Email already in use." });
            }
            
            const otpRecord = await OTP.findOne({ email, isVerified: true }).sort({ createdAt: -1 });
            if (!otpRecord) {
                return res.status(400).json({ error: "Please verify your new email first." });
            }
            
            user.email = email;
            await OTP.deleteMany({ email }); // clean up
        }

        if (profilePic) {
            const uploadedResponse = await cloudinary.uploader.upload(profilePic, {
                folder: "BaatCheet/Profile",
                fetch_format: "auto",
                quality: "auto",
            });
            user.profilePic = uploadedResponse.secure_url;
        }

        await user.save();

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import useUpdateProfile from "../hooks/useUpdateProfile";
import useSendProfileOtp from "../hooks/useSendProfileOtp";
import useVerifyProfileOtp from "../hooks/useVerifyProfileOtp";

const ProfileModal = ({ onClose }) => {
    const { authUser } = useAuthContext();
    const [fullName, setFullName] = useState(authUser.fullName);
    const [email, setEmail] = useState(authUser.email);
    const [profilePic, setProfilePic] = useState(authUser.profilePic);
    
    // OTP states
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [timer, setTimer] = useState(0);

    const fileInputRef = useRef(null);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const { loading: updateLoading, updateProfile } = useUpdateProfile();
    const { loading: sendOtpLoading, sendOtp } = useSendProfileOtp();
    const { loading: verifyOtpLoading, verifyOtp } = useVerifyProfileOtp();

    const isEmailChanged = email !== authUser.email;
    const isNameChanged = fullName !== authUser.fullName;
    const isPicChanged = profilePic !== authUser.profilePic;
    
    const hasChanges = isEmailChanged || isNameChanged || isPicChanged;
    const canSave = hasChanges && (!isEmailChanged || isEmailVerified);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setProfilePic(reader.result);
            };
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        const success = await sendOtp(email);
        if (success) {
            setIsOtpSent(true);
            setIsEmailVerified(false);
            setTimer(120); // start 2 minute countdown
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const success = await verifyOtp(email, otp);
        if (success) {
            setIsEmailVerified(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSave) return;
        const isNewPic = profilePic !== authUser.profilePic;
        await updateProfile({
            fullName,
            email: isEmailChanged ? email : null,
            profilePic: isNewPic ? profilePic : null
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-96 relative border border-base-300 shadow-2xl">
                <button className="absolute top-2 right-4 text-base-content opacity-70 hover:opacity-100 text-xl" onClick={onClose}>
                    ✕
                </button>
                <h2 className="text-2xl font-semibold mb-4 text-center text-base-content">Edit Profile</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <div className="relative group cursor-pointer mb-6" onClick={() => fileInputRef.current.click()}>
                        <img 
                            src={profilePic} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 group-hover:opacity-70 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs bg-black bg-opacity-70 px-2 py-1 rounded">Change</span>
                        </div>
                        <input 
                            type="file" 
                            hidden 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            accept="image/*"
                        />
                    </div>

                    <div className="w-full mb-2">
                        <label className="label p-2">
                            <span className="text-base label-text text-base-content">Full Name</span>
                        </label>
                        <input
                            type="text"
                            className="w-full input input-bordered h-10 bg-base-200 text-base-content"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="w-full mb-4">
                        <label className="label p-2">
                            <span className="text-base label-text text-base-content">Email Address</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                className="w-full input input-bordered h-10 bg-base-200 text-base-content"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setIsOtpSent(false);
                                    setIsEmailVerified(false);
                                }}
                                disabled={isOtpSent && !isEmailVerified}
                            />
                        </div>
                    </div>

                    {isEmailChanged && !isEmailVerified && !isOtpSent && (
                        <button type="button" onClick={handleSendOtp} className="btn btn-block bg-yellow-600 text-white hover:bg-yellow-500 border-none mb-4" disabled={sendOtpLoading}>
                            {sendOtpLoading ? <span className="loading loading-spinner"></span> : "Verify New Email"}
                        </button>
                    )}

                    {isEmailChanged && isOtpSent && !isEmailVerified && (
                        <div className="w-full mb-4">
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full input input-bordered h-10 bg-base-200 text-base-content"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <button type="button" onClick={handleVerifyOtp} className="btn bg-green-600 text-white hover:bg-green-500 border-none h-10" disabled={verifyOtpLoading}>
                                    {verifyOtpLoading ? <span className="loading loading-spinner"></span> : "Confirm"}
                                </button>
                            </div>
                            <button 
                                type="button" 
                                onClick={handleSendOtp} 
                                className="btn btn-block btn-sm btn-outline text-gray-300 border-gray-500 hover:bg-gray-600 hover:border-gray-500 mt-1" 
                                disabled={timer > 0 || sendOtpLoading}
                            >
                                {timer > 0 ? `Resend OTP in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}` : "Resend OTP"}
                            </button>
                        </div>
                    )}

                    {isEmailChanged && isEmailVerified && (
                        <div className="w-full mb-4 text-green-500 text-sm text-center font-semibold">
                            Email verified! You can now save changes.
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="btn btn-block bg-blue-600 text-white hover:bg-blue-500 border-none mt-2" 
                        disabled={updateLoading || !canSave}
                    >
                        {updateLoading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;

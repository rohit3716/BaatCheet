import { useState } from "react";
import toast from "react-hot-toast";

const useSendProfileOtp = () => {
    const [loading, setLoading] = useState(false);

    const sendOtp = async (email) => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/send-profile-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            toast.success(data.message || "OTP sent successfully to new email!");
            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { loading, sendOtp };
};
export default useSendProfileOtp;

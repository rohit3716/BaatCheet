import { useState } from "react";
import toast from "react-hot-toast";

const useVerifyProfileOtp = () => {
    const [loading, setLoading] = useState(false);

    const verifyOtp = async (email, otp) => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            toast.success(data.message || "Email verified successfully!");
            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { loading, verifyOtp };
};
export default useVerifyProfileOtp;

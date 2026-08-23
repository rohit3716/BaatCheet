import  { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';

const useSignup = () => {
    const [loading, setLoading ] = useState(false);
  const { setAuthUser } = useAuthContext();

    const sendOTP = async({ fullName, username, email, password, confirmPassword, gender}) => {
        const success = handleInputErrors({ fullName, username, email, password, confirmPassword, gender});
        if (!success) return false;

        setLoading(true);
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            toast.success("OTP sent to your email.");
            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (email, otp) => {
        if (!otp) {
            toast.error("Please enter the OTP");
            return false;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            toast.success("Email verified successfully.");
            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const signup = async({ fullName, username, email, password, confirmPassword, gender}) => {
        // console.log({ fullName, username, password, confirmPassword, gender});
        const success = handleInputErrors({ fullName, username,email, password, confirmPassword, gender});
        if( !success ) return;
    

    setLoading(true);

    try {
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, username,email, password, confirmPassword, gender }),
        });

        const data = await res.json();
        if( data.error ){
            throw new Error(data.error);
        }


        // console.log(data);

        //localstorage
        localStorage.setItem("chat-user", JSON.stringify(data));
        //context
        setAuthUser(data);
    } catch (error) {
        toast.error(error.message);
    }finally{
        setLoading(false);
    }

};

return {loading, signup, sendOTP, verifyOTP};
}

export default useSignup

function handleInputErrors({ fullName, username,email, password, confirmPassword, gender}){
    if( !fullName || !username || !email || !password || !confirmPassword || !gender){
        toast.error('Please fill out all fields');
        return false;
    }

    if( password !== confirmPassword ){
        toast.error( "Passwords do not match" );
        return false;
    }

    if( password.length < 6 ){
        toast.error("Password must be at least 6 characters. Please try again.");
        return false;
    }

    return true;
}
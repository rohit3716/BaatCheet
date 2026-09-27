import  { useState } from "react";
import GenderCheckbox from "./GenderCheckbox";
import { Link } from "react-router-dom";
import useSignup from "../../components/hooks/useSignup";

const SignUp = () => {

  const [inputs, setInputs] = useState({
    fullName:'',
    username:'',
    email: "",
    password:'',
    confirmPassword:'',
    gender:''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");

  const { loading, signup, sendOTP, verifyOTP} = useSignup();

  const handleCheckboxChange = (gender) =>{
    setInputs({...inputs, gender});
  }

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!inputs.email) return;
    const success = await sendOTP(inputs);
    if (success) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const success = await verifyOTP(inputs.email, otp);
    if (success) {
      setIsEmailVerified(true);
      setOtpSent(false);
    }
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    await signup(inputs);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-96 mx-auto px-4">
      <div className="w-full p-6 rounded-lg shadow-md bg-base-200 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 border border-base-300">
        <h1 className="text-3xl font-semibold text-center text-base-content">
          Sign Up <span className="text-blue-500"> BaatCheet</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full input input-bordered  h-10"
              value={inputs.fullName}
              onChange={(e) => setInputs({...inputs, fullName:e.target.value})}
            />
          </div>

          <div>
            <label className="label p-2 ">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="user_name"
              className="w-full input input-bordered h-10"
              value={inputs.username}
              onChange={(e)=>{setInputs({...inputs, username: e.target.value.toLowerCase()})}}
            />
          </div>
          <div>
               <label className="label p-2 ">
                <span className="text-base label-text">Email</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="w-full input input-bordered h-10"
                    value={inputs.email}
                    onChange={(e) => {
                      setInputs({ ...inputs, email: e.target.value });
                      setIsEmailVerified(false);
                      setOtpSent(false);
                    }}
                    disabled={isEmailVerified}
                  />
                  {!isEmailVerified && !otpSent && (
                    <button className="btn btn-sm h-10" onClick={handleSendOTP} disabled={loading || !inputs.email}>
                      Send OTP
                    </button>
                  )}
                  {isEmailVerified && (
                    <div className="flex items-center text-green-500 font-bold px-2">
                      ✓ Verified
                    </div>
                  )}
                </div>
                {otpSent && !isEmailVerified && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      className="w-full input input-bordered h-10 tracking-[0.5em] text-center font-bold"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                    />
                    <button className="btn btn-sm h-10 btn-primary" onClick={handleVerifyOTP} disabled={loading || otp.length < 6}>
                      Verify
                    </button>
                  </div>
                )}
              </div>

          <div>
            <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered h-10"
              value={inputs.password}
              onChange={(e) => setInputs({...inputs, password:e.target.value})}
            />
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full input input-bordered h-10"
              value={inputs.confirmPassword}
              onChange={(e) => setInputs({...inputs, confirmPassword:e.target.value})}
            />
          </div>

          <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender}/>

          <Link
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
            to={"/login"}
          >
            Already have an account?
          </Link>

          <div>
            <button className="btn btn-block btn-sm mt-4 border border-slate-700" disabled={loading || !isEmailVerified}>
             {loading ? <span className=" loading loading-spinner" ></span> : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUp;

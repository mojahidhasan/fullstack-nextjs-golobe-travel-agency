import { SignupForm } from "@/components/pages/signup/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen  p-6">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full text-center">
        <h2 className="mb-6  text-4xl font-extrabold  bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 tracking-wide">
          Sign Up
        </h2>
        <p className="text-base bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-300/60  mb-8">
          Let's get you set up so you can access your personal account  {"   "} ✨.
        </p>
        <SignupForm />
      </div>
    </div>
  );
}

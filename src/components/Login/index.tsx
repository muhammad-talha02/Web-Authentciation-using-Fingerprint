"use client";
import { styles } from "@/styles";
import { startAuthentication } from "@simplewebauthn/browser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const [loginValues, setLoginValues] = useState({
    email: "malik@gmail.com",
    password: "123456",
  });

  console.log("values ->", loginValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(loginValues).includes("")) {
      toast.error("Please fill required fields.");
      return;
    }
    try {
      const response = await fetch("/api/login-user", {
        body: JSON.stringify(loginValues),
        method: "POST",
      });

      const result = await response.json();
      console.log(result,"login")
      if (result.success) {
        await handleVerifiedPasskey(result?.data)
      } else {
        toast.error("Error: " +result.message);
      }
    } catch (error) {
      toast.error("Login failed!");
    }
  };

  const handleVerifiedPasskey = async (user: any) => {
    try {
      const response = await fetch("/api/authentication/login-challenge", {
        body: JSON.stringify(user),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.success) {
        const { options } = result;

        const authenticationResponse = await startAuthentication(options);
        console.log("authenticationResponse", authenticationResponse);
        const res = await fetch("/api/authentication/login-verify", {
          body: JSON.stringify({
            userId: user?._id,
            cred: authenticationResponse,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: "POST",
        });

        const resultVerification = await res.json();
        if (resultVerification.success) {
          toast.success("Login Successfully")
          router.push("/");
        } else {
          toast.error("Verification Failed");
        }
      } else {
        toast.error("something wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("hey failed!");
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Sign In
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={loginValues.email}
                  id="email"
                  className={styles.inputStyle}
                  // className={"bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}
                  placeholder="name@company.com"
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  onChange={handleChange}
                  value={loginValues.password}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className={styles.inputStyle}
                />
              </div>
             
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

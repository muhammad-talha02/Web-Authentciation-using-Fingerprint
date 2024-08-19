"use client";
import { styles } from "@/styles";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import FingerprintButton from "../FingerprintButton";
import { startRegistration } from "@simplewebauthn/browser";
import toast from "react-hot-toast";

const Register = () => {
  //? Router
  const router = useRouter();

  //? State: To Manage Conenction
  const [serverConnection, setServerConnection] = useState(false);

  //? State: To Show/Hide PassKey Scanner
  const [showPassKey, setShowPassKey] = useState(false);

  //? State: Register Values
  const [registerValues, setRegisterValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  //? Function: Handle change values of form
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterValues((prev) => ({ ...prev, [name]: value }));
  };

  //? Function: Register User
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(registerValues).includes("")) {
      toast.error("Please fill required fields.");
      return;
    }
    try {
      const response = await fetch("/api/register-user", {
        body: JSON.stringify(registerValues),
        method: "POST",
      });

      const result = await response.json();
      if (result.success) {
        setShowPassKey(true);
        await handleRegisterPasskey(result.data);
      } else {
        toast.error("User Already Exist");
      }
    } catch (error) {
      toast.error("Registration failed!");
    }
  };

  //? Function: Register Passkey
  const handleRegisterPasskey = async (user: any) => {
    //? Start Registartion
    try {
      const response = await fetch("/api/authentication/register-challenge", {
        body: JSON.stringify(user),
        method: "POST",
      });
      const resultChallenge = await response.json();

      if (resultChallenge.success) {
        const { options } = resultChallenge;

        const authenticationResponse = await startRegistration(options);

        //? Verify Registration
        const res = await fetch("/api/authentication/register-verify", {
          body: JSON.stringify({
            userId: user?._id,
            cred: authenticationResponse,
          }),
          method: "POST",
        });

        const resultVerification = await res.json();
        if (resultVerification.verified) {
          router.push("/login");
          toast.success("Device Registered Success");
        } else {
          toast.error("Failed to register device");
          setShowPassKey(false);
        }
      } else {
        toast.error("something wrong");
        setShowPassKey(false);
      }
    } catch (error) {
      setShowPassKey(false);
      toast.error("Failed Register!");
    }
  };

  //! Effect for Check server Connection
  useEffect(() => {
    const isServerActive = async () => {
      const res = await fetch("/api/test");
      const data = await res.json();
      if (data.success) {
        setServerConnection(true);
        return;
      }
      setServerConnection(false);
    };
    isServerActive();
  }, []);
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        {serverConnection ? "Server Connected" : "Server Connecting......"}
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Sign Up
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {showPassKey ? "Resgister Passkey" : "Create an account"}
            </h1>
            {showPassKey ? (
              <div className="flex justify-center items-center">
                <FingerprintButton />
              </div>
            ) : (
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleRegister}
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    value={registerValues.username}
                    name="username"
                    id="username"
                    className={styles.inputStyle}
                    placeholder="name@company.com"
                    required
                    minLength={5}
                    autoComplete="off"
                  />
                </div>
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
                    value={registerValues.email}
                    id="email"
                    className={styles.inputStyle}
                    placeholder="name@company.com"
                    required
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
                    value={registerValues.password}
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
                  Sign up
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;

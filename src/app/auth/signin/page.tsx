"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NoneSideBarLayout from "@/components/Layouts/NoneSideBarLayout";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { login } from "@/services/login.service";
import { resetPassword, forgotEmail } from "@/services/reset-password.service";
import { useRouter } from "next/navigation";
import { LoginType, ResetPasswordType } from "@/types/login";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SigninSchema = Yup.object().shape({
  email: Yup.string().min(2).max(50).required(),
  password: Yup.string().min(2).max(50).required(),
});

const SignIn: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [showForgotEmailModal, setShowForgotEmailModal] = useState(false);
  const [forgotEmailPhone, setForgotEmailPhone] = useState("");
  const [isFetchingEmail, setIsFetchingEmail] = useState(false);
  const [retrievedEmail, setRetrievedEmail] = useState("");

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword({ email: resetEmail });
      toast.success("Password reset link has been sent to your email.");
      setShowResetModal(false);
      setResetEmail("");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to send reset password email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsResetting(false);
    }
  };

  const handleForgotEmail = async () => {
    if (!forgotEmailPhone) {
      toast.error("Please enter your phone number.");
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(forgotEmailPhone)) {
      toast.error("Please enter a valid phone number (10-11 digits).");
      return;
    }

    setIsFetchingEmail(true);
    try {
      const response = await forgotEmail({ phone: forgotEmailPhone });
      const data = response?.data;
      
      if (data?.success && data?.email) {
        setRetrievedEmail(data.email);
        toast.success(data.message || "Email found successfully!");
      } else {
        toast.error(data?.message || "Could not find email associated with this phone number.");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to retrieve email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsFetchingEmail(false);
    }
  };

  return (
    <NoneSideBarLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link className="inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
              </Link>
              <span className="mt-15 inline-block">
                <Image
                  src="/images/logo/Luxury-2.png"
                  width={500}
                  height={500}
                  alt="Picture of the author"
                />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In
              </h2>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={SigninSchema}
                onSubmit={(values: LoginType) => {
                  login(values)
                    .then((data) => {
                      localStorage.setItem(
                        "accessToken",
                        data?.data?.user?.token,
                      );
                      localStorage.setItem(
                        "userLogin",
                        JSON.stringify(data?.data?.user),
                      );
                      toast.success("You are successfully logged in.");
                      router.push("/");
                    })
                    .catch((error) => {
                      toast.error("Username or password incorrect.");
                    });
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Email
                      </label>
                      <div className="relative">
                        <Field
                          type="email"
                          placeholder="Enter your email"
                          name="email"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />

                        <span className="absolute right-4 top-4">
                          <svg
                            className="fill-current"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.5">
                              <path
                                d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        {errors.email && touched.email ? (
                          <span className="ml-1 mt-1 flex items-center text-xs font-medium tracking-wide text-red">
                            {errors.email}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="mb-2.5 flex items-center justify-between">
                        <label className="block font-medium text-black dark:text-white">
                          Password
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowResetModal(true)}
                            className="text-sm font-medium text-primary transition-all duration-200 hover:text-primary/80 hover:underline hover:underline-offset-2"
                          >
                            Forgot Password?
                          </button>
                          <span className="text-sm text-gray-400 dark:text-gray-600">•</span>
                          <button
                            type="button"
                            onClick={() => setShowForgotEmailModal(true)}
                            className="text-sm font-medium text-primary transition-all duration-200 hover:text-primary/80 hover:underline hover:underline-offset-2"
                          >
                            Forgot Email?
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          {showPassword ? (
                            <svg
                              className="fill-current"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                                fill="currentColor"
                                opacity="0.6"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="fill-current"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                                fill="currentColor"
                                opacity="0.6"
                              />
                            </svg>
                          )}
                        </button>
                        {errors.password && touched.password ? (
                          <span className="ml-1 mt-1 flex items-center text-xs font-medium tracking-wide text-red">
                            {errors.password}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mb-5">
                      <input
                        type="submit"
                        value="Sign In"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                      />
                    </div>

                    {/* <button className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                  <span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_191_13499)">
                        <path
                          d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                          fill="#4285F4"
                        />
                        <path
                          d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                          fill="#34A853"
                        />
                        <path
                          d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                          fill="#EB4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_191_13499">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  Sign in with Google
                </button> */}

                    {/* <div className="mt-6 text-center">
                  <p>
                    Don’t have any account?{" "}
                    <Link href="/auth/signup" className="text-primary">
                      Sign Up
                    </Link>
                  </p>
                </div> */}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-strokedark dark:bg-boxdark">
            <button
              onClick={() => {
                setShowResetModal(false);
                setResetEmail("");
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-black dark:text-white">
                Reset Password
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Email
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleResetPassword();
                  }
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetEmail("");
                }}
                className="flex-1 rounded-lg border border-stroke bg-transparent py-3 px-4 text-black transition hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-boxdark-2"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                disabled={isResetting}
                className="flex-1 rounded-lg border border-primary bg-primary py-3 px-4 text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResetting ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Email Modal */}
      {showForgotEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-strokedark dark:bg-boxdark">
            <button
              onClick={() => {
                setShowForgotEmailModal(false);
                setForgotEmailPhone("");
                setRetrievedEmail("");
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-black dark:text-white">
                Forgot Email?
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter your phone number and we&apos;ll help you find your email address.
              </p>
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Phone Number
              </label>
              <input
                type="tel"
                value={forgotEmailPhone}
                onChange={(e) => setForgotEmailPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleForgotEmail();
                  }
                }}
              />
            </div>

            {retrievedEmail && (
              <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-medium text-black dark:text-white">
                  Your email address:
                </p>
                <p className="mt-1 text-lg font-bold text-primary">
                  {retrievedEmail}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowForgotEmailModal(false);
                  setForgotEmailPhone("");
                  setRetrievedEmail("");
                }}
                className="flex-1 rounded-lg border border-stroke bg-transparent py-3 px-4 text-black transition hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-boxdark-2"
              >
                Close
              </button>
              <button
                onClick={handleForgotEmail}
                disabled={isFetchingEmail}
                className="flex-1 rounded-lg border border-primary bg-primary py-3 px-4 text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetchingEmail ? "Searching..." : "Find Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </NoneSideBarLayout>
  );
};

export default SignIn;

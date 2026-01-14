"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import NoneSideBarLayout from "@/components/Layouts/NoneSideBarLayout";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { resetPasswordConfirm } from "@/services/reset-password.service";
import { ResetPasswordConfirmType } from "@/types/login";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});

const ResetPasswordContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (!emailParam || !tokenParam) {
      toast.error("Invalid reset password link. Missing email or token.");
      router.push("/auth/signin");
      return;
    }

    setEmail(emailParam);
    setToken(tokenParam);
  }, [searchParams, router]);

  const handleSubmit = async (values: {
    password: string;
    password_confirmation: string;
  }) => {
    if (!email || !token) {
      toast.error("Invalid reset password link.");
      return;
    }

    setIsSubmitting(true);
    try {
      const resetData: ResetPasswordConfirmType = {
        email,
        token,
        password: values.password,
        password_confirmation: values.password_confirmation,
      };

      await resetPasswordConfirm(resetData);
      toast.success("Password has been reset successfully. Please sign in.");
      router.push("/auth/signin");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email || !token) {
    return null;
  }

  return (
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
              <Image
                className="block dark:hidden"
                src={"/images/logo/logo-dark.svg"}
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
                alt="Logo Illustration"
              />
            </span>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Reset Password
            </h2>
            <Formik
              initialValues={{
                password: "",
                password_confirmation: "",
              }}
              validationSchema={ResetPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      New Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your new password"
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

                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        name="password_confirmation"
                        placeholder="Confirm your new password"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        {showConfirmPassword ? (
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
                      {errors.password_confirmation &&
                      touched.password_confirmation ? (
                        <span className="ml-1 mt-1 flex items-center text-xs font-medium tracking-wide text-red">
                          {errors.password_confirmation}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mb-5">
                    <input
                      type="submit"
                      value={isSubmitting ? "Resetting..." : "Reset Password"}
                      disabled={isSubmitting}
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="mt-6 text-center">
                    <p>
                      Remember your password?{" "}
                      <Link href="/auth/signin" className="text-primary">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage: React.FC = () => {
  return (
    <NoneSideBarLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </NoneSideBarLayout>
  );
};

export default ResetPasswordPage;

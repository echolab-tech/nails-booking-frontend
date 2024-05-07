"use client";
import {
  useState,
  useEffect,
  JSXElementConstructor,
  ReactElement,
  useLayoutEffect,
} from "react";
import { redirect } from "next/navigation";

export { RouteGuard };

const RouteGuard = (props: {
  children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
}) => {
  const { children } = props;

  useLayoutEffect(() => {
    authCheck();
    // on initial load - run auth check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck() {
    // redirect to login page if accessing a private page and not logged in

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      redirect("auth/signin");
    }
  }

  return children;
};

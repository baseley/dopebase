"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginView } from "../../modules/auth/components/LoginView";
import useCurrentUser from "../../modules/auth/hooks/useCurrentUser";

const Login = () => {
  const [user, token, loading] = useCurrentUser();
  const router = useRouter();

  // Prevent navigation inside render
  useEffect(() => {
    if (!loading && user) {
      console.log("Already logged in, redirecting...");
      router.push(".");
    }
  }, [loading, user, router]); // Only run when loading or user changes

  if (loading) {
    return null; // Don't render anything while loading
  }

  return <LoginView />;
};

export default Login;

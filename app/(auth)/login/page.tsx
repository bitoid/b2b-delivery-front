"use client";

import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import { useEffect } from "react";
import { getSession, signOut } from "next-auth/react";

export default function LoginPage() {
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) {
        signOut();
      }
    })();
  }, []);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            ავტორიზაცია
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}

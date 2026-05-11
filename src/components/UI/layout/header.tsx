"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import logo from "@/app/tolmalogo.webp";
import { siteConfig } from "@/config/site.config";
import RegistrationModal from "../modals/registration.modal";
import LoginModal from "../modals/login.modal";
import { signOutFunc } from "@/actions/sign-out";
import { useAuthStore } from "@/store/auth.store";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isAuth, status, session, setAuthState } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOutFunc();
    } catch (error) {
      console.log("error:", error);
    }

    setAuthState("unauthenticated", null);
  };

  const getLinkItems = () =>
    siteConfig.links.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className={`rounded-md px-3 py-1.5 text-lg transition-colors ${
          pathname === href
            ? "bg-blue-50 font-medium text-blue-900 dark:bg-blue-950 dark:text-blue-200"
            : "hover:bg-neutral-100 hover:text-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800"
        }`}
      >
        {label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Image width={70} src={logo} alt={siteConfig.description} />
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-75 dark:text-neutral-100"
          >
            Armenian cuisine
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {getLinkItems()}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {status === "loading" ? (
            <p>Loading...</p>
          ) : isAuth ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Hello, {session?.user?.email}!
              </p>

              <button
                onClick={handleSignOut}
                className="rounded-md px-4 py-2 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="rounded-md px-4 py-2 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Log in
              </button>

              <button
                onClick={() => setIsRegistrationOpen(true)}
                className="rounded-md bg-blue-900 px-4 py-2 text-base font-medium text-white transition-opacity hover:opacity-85 dark:bg-blue-700"
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-label="Open menu"
        >
          <span
            className={`block h-0.5 w-5 bg-neutral-900 transition-transform duration-200 dark:bg-neutral-100 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-neutral-900 transition-opacity duration-200 dark:bg-neutral-100 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-neutral-900 transition-transform duration-200 dark:bg-neutral-100 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 pb-4 pt-2 dark:border-neutral-800 dark:bg-neutral-950 md:hidden">
          <nav className="flex flex-col gap-1">
            {getLinkItems()}
            <div className="mt-2 flex flex-col gap-2 border-t border-neutral-200 pt-2 dark:border-neutral-800">
              <button
                onClick={() => {
                  setIsLoginOpen(true);
                  setMenuOpen(false);
                }}
                className="rounded-md px-4 py-2 text-center text-base font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  setIsRegistrationOpen(true);
                  setMenuOpen(false);
                }}
                className="rounded-md bg-blue-900 px-4 py-2 text-center text-base font-medium text-white dark:bg-blue-700"
              >
                Sign up
              </button>
            </div>
          </nav>
        </div>
      )}

      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}

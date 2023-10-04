"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";

const MobileNav = (props: { onLogOut: () => void; adminMenu: boolean }) => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setNavOpen(!navOpen)}
        className="md:hidden"
      >
        {navOpen ? (
          <XIcon className="stroke-primary-foreground" />
        ) : (
          <MenuIcon className="stroke-primary-foreground" />
        )}
      </button>
      {navOpen &&
        createPortal(
          <div className="fixed bottom-0 left-0 right-0 top-[--header-height] bg-black bg-opacity-60 md:hidden">
            <div className="bg-primary">
              <nav className="container flex flex-col gap-8 py-12 text-end text-xl capitalize text-primary-foreground">
                {props.adminMenu && (
                  <Link
                    href="/admin/projekty"
                    onClick={() => setNavOpen(false)}
                  >
                    Administracja
                  </Link>
                )}
                <Link href="/projekty" onClick={() => setNavOpen(false)}>
                  projekty
                </Link>
                <Link href="/profil" onClick={() => setNavOpen(false)}>
                  ustawienia
                </Link>
                <button className=" text-end" onClick={() => props.onLogOut()}>
                  Wyloguj
                </button>
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default MobileNav;

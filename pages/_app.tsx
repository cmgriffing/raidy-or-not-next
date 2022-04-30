import "../styles/globals.css";
import type { AppProps } from "next/app";

import "primereact/resources/themes/vela-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Container } from "../components/Container";
import { TwitchButton } from "../components/TwitchButton";
import Link from "next/link";
import Logo from "../assets/logo.svg";
import { useHookstate } from "@hookstate/core";
import { $authToken } from "../stores/auth";
import { PropsWithChildren } from "react";

function SafeHydrate({ children }: PropsWithChildren<{}>) {
  return <div suppressHydrationWarning={true}>{children}</div>;
}

function MyApp({ Component, pageProps }: AppProps) {
  const authToken = useHookstate($authToken);

  const isLoggedIn = !!authToken.get();
  return (
    <SafeHydrate>
      <div className="bg-[color:var(--surface-a)]">
        <Container>
          <header className="flex flex-row items-center p-2">
            <Link href={isLoggedIn ? "/dashboard" : "/"}>
              <Logo
                height="40px"
                width="40px"
                className="mr-2 cursor-pointer"
                alt="Logo"
              />
            </Link>
            <Link href={isLoggedIn ? "/dashboard" : "/"}>
              <span className="text-primary no-underline text-xl flex flex-row items-center font-bold cursor-pointer">
                Raidy or Not
              </span>
            </Link>
            <div className="flex flex-1"></div>
            {isLoggedIn && (
              <div className="mr-8 cursor-pointer">
                <Link href="/dashboard">
                  <span className="no-underline ">Dashboard</span>
                </Link>
              </div>
            )}
            {!isLoggedIn && <TwitchButton />}
            {isLoggedIn && (
              <Link href="/logged-out">
                <span className="p-button no-underline  w-40 justify-center">
                  Logout
                </span>
              </Link>
            )}
          </header>
        </Container>
      </div>
      <main>
        <Component {...pageProps} />
      </main>
    </SafeHydrate>
  );
}

export default MyApp;

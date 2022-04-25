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
              <>
                <img
                  alt="light bulb icon"
                  src={Logo.src}
                  height="40"
                  width="40"
                  className="mr-2"
                />
                <span className="text-primary no-underline text-xl flex flex-row items-center font-bold">
                  Raidy or Not
                </span>
              </>
            </Link>
            <div className="flex flex-1"></div>
            {!isLoggedIn && <TwitchButton />}
            {isLoggedIn && (
              <Link href="/logged-out">
                <span className="p-button no-underline">Logout</span>
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

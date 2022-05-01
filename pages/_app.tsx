import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Head } from "next/document";

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
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#b052c0" />
        <meta name="msapplication-TileColor" content="#9f00a7" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
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

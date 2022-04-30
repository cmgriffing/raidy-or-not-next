import type { NextPage } from "next";
import Link from "next/link";
import { TwitchButton } from "../components/TwitchButton";
import { PipesAnimation } from "../components/PipesAnimation";
import Logo from "../assets/logo.svg";
import { useWindowWidth } from "@react-hook/window-size";

import GlobeSvg from "../assets/globe.svg";
import AirplaneSvg from "../assets/airplane.svg";
import TimeSvg from "../assets/time.svg";
import RobotSvg from "../assets/robot.svg";
import ChartSvg from "../assets/chart.svg";
import KeySvg from "../assets/key.svg";
import HandshakeSvg from "../assets/handshake.svg";
import { useHookstate } from "@hookstate/core";
import { $authToken } from "../stores/auth";

const features = [
  {
    image: ChartSvg,
    title: "Track Incoming Raids",
    paragraph:
      "It is easy to forget who raids you all the time and how frequently.",
  },
  {
    image: HandshakeSvg,
    title: "See Outgoing Raid History",
    paragraph:
      "Sometimes you end up raiding some people more often than others.",
  },
  {
    image: GlobeSvg,
    title: "Cross-Platform",
    paragraph:
      "The bot runs on all major operating systems. MacOS, Windows, and even Linux.",
  },
];

const howItWorksSteps = [
  {
    image: KeySvg,
    title: "Sign up or login",
    paragraph:
      "Using your Twitch account makes signing up a snap. No extra passwords to remember.",
  },
  {
    image: RobotSvg,
    title: "Download the bot",
    paragraph:
      "The bot is how we know who raids you and who you raid. Once installed and configured, it will sit in your system tray unobtrusively.",
  },
  {
    image: TimeSvg,
    title: "Give it some time",
    paragraph:
      "It can take a bit of time for the raid history to be deep enough to offer useful results.",
  },
  {
    image: AirplaneSvg,
    title: "Get to raiding",
    paragraph: `That's it. Use the app here to figure out who to raid when you are ready.`,
  },
];

const Home: NextPage = () => {
  const windowWidth = useWindowWidth();
  const authToken = useHookstate($authToken);

  const isLoggedIn = !!authToken.get();

  return (
    <div>
      <div
        style={{ position: "relative" }}
        className="min-h-[100vh] overflow-x-hidden"
      >
        {windowWidth > 800 && <PipesAnimation />}
        <section className="" style={{ zIndex: 1, position: "relative" }}>
          <div className="container mx-auto flex px-5 py-8 items-center justify-center flex-col">
            <Logo className="lg:w-2/6 md:w-3/6 w-5/6 object-cover object-center rounded max-w-full h-auto" />
            <div className="text-center lg:w-2/3 w-full">
              <h1 className="title-font sm:text-4xl text-4xl xl:text-5xl 2xl:text-6xl mb-4 font-bold">
                Raidy or Not
              </h1>
              <p className="mb-8 leading-relaxed xl:text-xl 2xl:text-2xl">
                {"We're gonna find you a raid."}
              </p>
              <div className="flex justify-center">
                {isLoggedIn && (
                  <Link href="/dashboard">
                    <span className="p-button no-underline  w-40 justify-center xl:text-xl">
                      Dashboard
                    </span>
                  </Link>
                )}
                {!isLoggedIn && <TwitchButton />}
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="body-font">
        <div className="container px-5 py-24 mx-auto">
          <h2 className="sm:text-3xl text-2xl font-medium title-font text-center mb-20 mt-10">
            Features
          </h2>
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            {features.map((feature, index) => (
              <div className="p-4 md:w-1/3 flex" key={index}>
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-brand-50 text-brand-500 mb-4 flex-shrink-0">
                  <feature.image height="2rem" width="2rem" />
                </div>
                <div className="flex-grow pl-6">
                  <h2 className="text-lg title-font font-medium mb-2 xl:text-xl 2xl:text-2xl">
                    {feature.title}
                  </h2>
                  <p className="leading-relaxed text-base xl:text-lg 2xl:text-xl">
                    {feature.paragraph}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="body-font">
        <h2 className="sm:text-3xl text-2xl font-medium title-font text-center mt-20">
          How does it work?
        </h2>
        <div className="container px-5 py-24 mx-auto flex flex-col flex-wrap md:flex-nowrap">
          {howItWorksSteps.map((step, index) => (
            <div
              key={index}
              className="flex relative pt-10 pb-20 sm:items-center md:w1/2  mx-auto"
            >
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-brand-500 text-white relative z-10 title-font font-medium text-md  xl:text-lg 2xl:text-xl">
                {index + 1}
              </div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="flex-shrink-0 w-24 h-24 bg-brand-50 text-brand-500 rounded-full inline-flex items-center justify-center">
                  <step.image height="3rem" width="3rem" />
                </div>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font mb-1 text-lg xl:text-xl 2xl:text-2xl">
                    {step.title}
                  </h2>
                  <p className="leading-relaxed max-w-[320px] xl:text-lg 2xl:text-xl">
                    {step.paragraph}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
            <h1 className="flex-grow sm:pr-16 text-2xl font-medium title-font">
              Its free and worth every penny. Getting started is as easy as
              signing up and downloading the bot.
            </h1>
            <TwitchButton />
          </div>
        </div>
      </section>
      <footer>
        <div className="text-center">
          <Link href="https://github.com/cmgriffing/raidy-or-not">
            <span className="">Github</span>
          </Link>
        </div>
        <div className="text-center">
          &copy; Chris Griffing {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Home;

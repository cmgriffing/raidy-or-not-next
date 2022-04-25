import type { NextPage } from "next";
import Link from "next/link";
import { TwitchButton } from "../components/TwitchButton";
import { PipesAnimation } from "../components/PipesAnimation";
import Logo from "../assets/logo.svg";
import { useWindowWidth } from "@react-hook/window-size";

const features = [
  {
    image: "",
    title: "Track Incoming Raids",
    paragraph:
      "It is easy to forget who raids you all the time and how frequently.",
  },
  {
    image: "",
    title: "See Outgoing Raid History",
    paragraph:
      "Sometimes you end up raiding some people more often than others.",
  },
  {
    image: "",
    title: "Cross-Platform",
    paragraph:
      "The bot runs on all major operating systems. MacOS, Windows, and even Linux.",
  },
];

const howItWorksSteps = [
  {
    image: "",
    title: "Sign up or login",
    paragraph:
      "Using your Twitch account makes signing up a snap. No extra passwords to remember.",
  },
  {
    image: "",
    title: "Download the bot",
    paragraph:
      "The bot is how we know who raids you and who you raid. Once installed and configured, it will sit in your system tray unobtrusively.",
  },
  {
    image: "",
    title: "Give it some time",
    paragraph:
      "It can take a bit of time for the raid history to be deep enough to offer useful results.",
  },
  {
    image: "",
    title: "Get to raiding",
    paragraph: `That${"&apos;"}s it. Use the app here to figure out who to raid when you are ready.`,
  },
];

const Home: NextPage = () => {
  const windowWidth = useWindowWidth();

  return (
    <div>
      <div style={{ position: "relative" }}>
        {windowWidth > 800 && <PipesAnimation />}
        <section className="" style={{ zIndex: 1, position: "relative" }}>
          <div className="container mx-auto flex px-5 py-8 items-center justify-center flex-col">
            <img
              className="lg:w-2/6 md:w-3/6 w-5/6 object-cover object-center rounded max-w-full h-auto"
              alt="hero"
              src={Logo.src}
            />
            <div className="text-center lg:w-2/3 w-full">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium">
                Raidy or Not
              </h1>
              <p className="mb-8 leading-relaxed">
                We${"&apos;"}re gonna find you a raid.
              </p>
              <div className="flex justify-center">
                <TwitchButton />
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="body-font">
        <div className="container px-5 py-24 mx-auto">
          <h2 className="sm:text-3xl text-2xl font-medium title-font text-center mb-10 mt-10">
            Features
          </h2>
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            {features.map((feature, index) => (
              <div className="p-4 md:w-1/3 flex" key={index}>
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div className="flex-grow pl-6">
                  <h2 className="text-lg title-font font-medium mb-2">
                    {feature.title}
                  </h2>
                  <p className="leading-relaxed text-base">
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
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">
                {index}
              </div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="flex-shrink-0 w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full inline-flex items-center justify-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-12 h-12"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font mb-1 text-xl">
                    {step.title}
                  </h2>
                  <p className="leading-relaxed max-w-[320px]">
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

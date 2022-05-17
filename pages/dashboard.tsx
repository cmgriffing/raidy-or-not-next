import { $authToken, $twitchToken } from "../stores/auth";
import { User } from "../server/repositories/users";
import jwtDecode from "jwt-decode";
import WindowsIcon from "../assets/windows.svg";
import MacosIcon from "../assets/macos.svg";
import LinuxIcon from "../assets/linux.svg";
import { ApiPath } from "../types/api";
import { Release } from "../types/github";
import { lt as semverLessThan } from "semver";
import { Icon } from "@iconify/react";

import router from "next/router";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Badge } from "primereact/badge";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import axios, { AxiosInstance } from "axios";
import { useHookstate } from "@hookstate/core";
import { createJwtAxios, createTwitchAxios } from "../utils/axios";
import { ReadonlyPassword } from "../components/ReadonlyPassword";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TwitchStream } from "../types/twitch";
import { Raid } from "../types/models";
dayjs.extend(relativeTime);

interface Raids {
  incomingRaids: Raid[];
  outgoingRaids: Raid[];
}

export default function Dashboard() {
  const toast = useRef<Toast>(null);
  const [apiKey, setApiKey] = useState("");
  const [raids, setRaids] = useState<Raids>({
    incomingRaids: [],
    outgoingRaids: [],
  });
  const [channelScoresMap, setChannelScoresMap] = useState(
    {} as Record<string, number>
  );
  const [hasOutdatedBot, setHasOutdatedBot] = useState(false);
  const [latestBotVersion, setLatestBotVersion] = useState("0.0.0");

  const authToken = useHookstate($authToken);
  const twitchToken = useHookstate($twitchToken);

  const resetApiKey = useCallback(async () => {
    const apiAxios = createJwtAxios(router, authToken.get());
    const apiKeyResponse = await apiAxios.post(ApiPath.PostApiKey);
    setApiKey(apiKeyResponse.data.token);
  }, [authToken.get()]);

  const [downloadIcons, setDownloadIcons] = useState([
    { image: WindowsIcon, label: "Windows", link: "" },
    { image: MacosIcon, label: "MacOS", link: "" },
    { image: LinuxIcon, label: "Linux", link: "" },
  ]);

  const [streamsMap, setStreamsMap] = useState(
    {} as Record<string, TwitchStream>
  );
  const [channelNames, setChannelNames] = useState([] as string[]);
  const [recommendedChannels, setRecommendedChannels] = useState(
    [] as string[]
  );

  const resetApiKeyMenu = useRef<Menu>(null);

  const copyHandler = async function () {
    await navigator.clipboard.writeText(apiKey);

    toast.current?.show({
      severity: "success",
      summary: "API Key copied",
      life: 3000,
    });
  };

  const copyRaidCommand = (channelName: string) => {
    navigator.clipboard.writeText(`/raid ${channelName}`);

    toast.current?.show({
      severity: "success",
      summary: "Raid command copied",
      life: 3000,
    });
  };

  const resetApiKeyMenuItems = [
    {
      label: "Reset API Key",
      icon: "pi pi-refresh",
      command: async () => {
        await resetApiKey();
        toast.current?.show({
          severity: "success",
          summary: "API Key reset",
          life: 3000,
        });
      },
    },
  ];

  function toggleApiKeyMenu(event: any) {
    resetApiKeyMenu.current?.toggle(event);
  }

  useEffect(() => {
    if (!authToken.get() || !twitchToken.get()) {
      return;
    }

    const newApiAxios = createJwtAxios(router, authToken.get());
    const newTwitchAxios = createTwitchAxios(router, twitchToken.get());

    if (!authToken.get()) {
      router.push("/logged-out");
      return;
    }

    getReleases().then(({ releases, latestVersion }) => {
      setLatestBotVersion(latestVersion);
      setDownloadIcons(releases);
    });

    const decoded = jwtDecode(authToken.get()) as { sub: { user: User } };
    const user = decoded.sub.user;

    newApiAxios.get(ApiPath.GetApiKey).then((apiKeyResponse) => {
      setApiKey(apiKeyResponse.data.token);
    });

    newApiAxios.get<Raids>(ApiPath.GetRaids).then((raidsResponse) => {
      const newRaids = raidsResponse.data;
      setRaids(newRaids);

      const newChannelScoresMap = getChannelScoresMap(newRaids);
      setChannelScoresMap(newChannelScoresMap);

      const newChannelNames = getChannelNames(newRaids, user.twitchName);
      setChannelNames(newChannelNames);
    });
  }, [authToken.get(), twitchToken.get()]);

  useEffect(() => {
    const latestOutgoingRaid =
      raids.outgoingRaids[raids.outgoingRaids.length - 1];
    if (raids?.incomingRaids[0] || latestOutgoingRaid) {
      let latestRaidVersion = "0.0.0";

      latestRaidVersion = raids?.incomingRaids[0]?.botVersion || "0.0.0";

      if (
        latestOutgoingRaid &&
        !semverLessThan(latestOutgoingRaid.botVersion, latestRaidVersion)
      ) {
        latestRaidVersion = latestOutgoingRaid.botVersion;
      }

      console.log({ latestBotVersion, latestRaidVersion });

      setHasOutdatedBot(semverLessThan(latestRaidVersion, latestBotVersion));
    }
  }, [latestBotVersion, raids]);

  useEffect(() => {
    console.log({ twitchToken, channelNames });
    if (!twitchToken.get() || !channelNames.length) {
      return;
    }

    const newTwitchAxios = createTwitchAxios(router, twitchToken.get());

    getStreamsMap(newTwitchAxios, channelNames).then((newStreamsMap) => {
      console.log({ newStreamsMap });

      setStreamsMap(newStreamsMap);

      setRecommendedChannels(
        channelNames
          .filter((channel) => {
            return newStreamsMap[channel]?.type === "live";
          })
          .sort((channelA, channelB) => {
            const channelAScore = channelScoresMap[channelA] || 0;
            const channelBScore = channelScoresMap[channelB] || 0;

            return channelAScore - channelBScore;
          })
      );
    });
  }, [twitchToken.get(), channelNames, channelScoresMap]);

  return (
    <div className="py-10 mx-auto w-full sm:w-[480px] md:w-[768px]">
      {hasOutdatedBot && (
        <div className="w-full items-center flex flex-column justify-center p-2">
          <div className="mx-auto p-4 bg-red-200 text-black rounded border border-red-500">
            <h2 className="text-2xl font-bold text-black mb-4 text-center flex flex-row items-center justify-center">
              <Icon icon="bxs:hot" width="32" height="32" className="mr-1" />
              Warning!
            </h2>
            <p className="max-w-[28rem] mx-auto mb-4">
              Your most recent raids are running an outdated version of the bot.
              Upgrade now to get the latest bug fixes and features.
            </p>
            <p className="max-w-[28rem] mx-auto">
              If you have already upgraded, this message will disappear on your
              next incoming or outgoing raid.
            </p>
          </div>
        </div>
      )}

      <div className="w-full items-center flex flex-column justify-center p-2">
        <Card
          className="w-full"
          title={
            <h2 className="flex flex-row items-center">
              <Icon
                icon="bxs:book-add"
                width="32"
                height="32"
                className="mr-1"
              />
              Recommendations
            </h2>
          }
        >
          {!!recommendedChannels?.length && (
            <p className="pb-4">
              Select a channel to copy the raid command to your clipboard.
            </p>
          )}

          {!!recommendedChannels?.length && (
            <div className="flex flex-row items-center justify-center">
              {recommendedChannels?.slice(0, 4).map((channel) => (
                <button
                  key={channel}
                  className="block text-center"
                  onClick={() => {
                    copyRaidCommand(channel);
                  }}
                >
                  <img
                    src={streamsMap[channel].thumbnail_url}
                    alt={`Image preview for ${channel}`}
                  />
                  <div className="flex flex-row items-center justify-center">
                    <span className="block text-2xl mr-2">{channel}</span>
                    {channelScoresMap[channel] < 0 && (
                      <Badge severity="danger">
                        {channelScoresMap[channel]}
                      </Badge>
                    )}
                    {channelScoresMap[channel] === 0 && (
                      <Badge severity="info">{channelScoresMap[channel]}</Badge>
                    )}

                    {channelScoresMap[channel] > 0 && (
                      <Badge severity="success">
                        {channelScoresMap[channel]}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!recommendedChannels?.length && (
            <p className="text-center">No recommended channels at this time.</p>
          )}
        </Card>
      </div>

      <div className="w-full flex flex-row flex-wrap justify-center">
        <div className="p-2 w-full md:w-1/2">
          <Card
            className="h-full"
            title={
              <div className="flex flex-row">
                <h2 className="flex flex-row items-center">
                  <Icon
                    icon="bxs:key"
                    width="32"
                    height="32"
                    className="mr-1"
                  />
                  API Key
                </h2>
                <div className="flex-1"></div>
                <Button
                  type="button"
                  className="p-button-rounded p-button-text p-button-plain"
                  icon="pi pi-ellipsis-v"
                  onClick={toggleApiKeyMenu}
                />
                <Menu
                  ref={resetApiKeyMenu}
                  model={resetApiKeyMenuItems}
                  popup={true}
                />
              </div>
            }
          >
            <div className="w-80">
              <p className="">You will use this key when running the bot.</p>
              <p className="">
                It can be reset using the menu at the top of this card.
              </p>
            </div>
            <div className="flex-row items-center justify-center text-center mt-8">
              <label className="sr-only">API Key </label>
              <div className="p-inputgroup flex-1">
                <ReadonlyPassword
                  password={apiKey}
                  feedback={false}
                  toggleMask={true}
                  onFocus={(event) => {
                    (event.currentTarget as HTMLInputElement)?.select();

                    toast.current?.show({
                      severity: "success",
                      summary: "API Key copied",
                      life: 3000,
                    });
                  }}
                />

                <Button className="p-inputgroup-addon" onClick={copyHandler}>
                  Copy
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <div className="p-2  w-full md:w-1/2">
          <Card
            className="h-full"
            title={
              <h2 className="flex flex-row items-center">
                <Icon icon="bxs:bot" width="32" height="32" className="mr-1" />
                Bot
              </h2>
            }
          >
            <p className="w-80 mb-3">
              To track incoming and outgoing raids, you will need to have a bot
              running on your machine. You can get it here:
            </p>

            <div className="flex flex-row items-center justify-center mt-4">
              {downloadIcons.map((icon) => (
                <a
                  key={icon.label}
                  href={icon.link}
                  download
                  className="text-center mx-2 w-20 inline-block bg-[color:var(--primary-color)] rounded p-2 active:opacity-70"
                >
                  <icon.image
                    className="invert mx-auto"
                    height="40px"
                    width="40px"
                  />
                  <span>{icon.label}</span>
                </a>
              ))}
            </div>

            <p className="mt-6 text-center">
              You can also see the latest releases on
              <Link href="https://github.com/cmgriffing/raidy-or-not-bot/releases">
                <a className="text-brand-300 ml-1 cursor-pointer">Github</a>
              </Link>
              .
            </p>
          </Card>
        </div>
      </div>

      {!!raids?.incomingRaids?.length && !!raids?.outgoingRaids?.length && (
        <div>
          <div className="flex flex-row justify-center flex-wrap">
            <div className="incoming-raids p-2  w-full md:w-1/2">
              <Card
                className="h-full"
                title={
                  <h2 className="font-bold flex flex-row items-center">
                    <Icon
                      icon="bxs:plane-land"
                      width="32"
                      height="32"
                      className="mr-1"
                    />
                    Incoming Raids
                  </h2>
                }
              >
                <ol>
                  {raids?.incomingRaids.map((raid) => (
                    <li
                      className="flex flex-row p-1 relative"
                      key={raid.fromTwitchChannel + raid.createdAt}
                    >
                      {streamsMap[raid.fromTwitchChannel]?.type === "live" && (
                        <span
                          className="live-dot absolute left-[-12px] top-[12px]"
                          style={{
                            display: "inline-block",
                            background: "red",
                            height: "10px",
                            width: "10px",
                            borderRadius: "100%",
                          }}
                        ></span>
                      )}
                      <span className="pr-8">
                        {raid?.fromTwitchChannel?.toLowerCase()}
                      </span>
                      <span className="flex-1"></span>
                      {dayjs(raid.createdAt * 1000).fromNow()}
                    </li>
                  ))}
                </ol>
              </Card>
            </div>
            <div className="outgoing-raids p-2 w-full md:w-1/2">
              <Card
                className="h-full"
                title={
                  <h2 className="font-bold flex flex-row items-center">
                    {" "}
                    <Icon
                      icon="bxs:plane-take-off"
                      width="32"
                      height="32"
                      className="mr-1"
                    />
                    Outgoing Raids
                  </h2>
                }
              >
                <ol>
                  {raids.outgoingRaids.map((raid) => (
                    <li
                      className="p-1 flex flex-row relative"
                      key={raid.toTwitchChannel + raid.createdAt}
                    >
                      {streamsMap[raid.toTwitchChannel]?.type === "live" && (
                        <span className="live-dot absolute left-[-12px] top-[12px]"></span>
                      )}
                      <span className="pr-8">
                        {raid?.toTwitchChannel?.toLowerCase()}
                      </span>
                      <span className="flex-1"></span>
                      {dayjs(raid.createdAt * 1000).fromNow()}
                    </li>
                  ))}
                </ol>
              </Card>
            </div>
          </div>
        </div>
      )}

      <Toast ref={toast} position="bottom-center" />
    </div>
  );
}

async function getReleases() {
  const { data: releases } = await axios.get<Release[]>(
    "https://api.github.com/repos/cmgriffing/raidy-or-not-bot/releases"
  );

  const productionReleases = releases.filter((release) => {
    if (release.tag_name.endsWith("-dev")) {
      return false;
    }

    if (release.draft || release.prerelease) {
      return false;
    }

    return true;
  });

  const latestVersion = productionReleases[0].name;

  console.log({ productionReleases });

  const [linuxRelease, macRelease, windowsRelease] = [
    ".AppImage",
    ".dmg",
    ".exe",
  ].map((extension) => {
    return productionReleases[0].assets.find(
      (asset) =>
        asset.browser_download_url.indexOf(extension) ===
        asset.browser_download_url?.length - extension.length
    )?.browser_download_url;
  });

  return {
    releases: [
      { image: WindowsIcon, label: "Windows", link: windowsRelease || "" },
      { image: MacosIcon, label: "MacOS", link: macRelease || "" },
      { image: LinuxIcon, label: "Linux", link: linuxRelease || "" },
    ],
    latestVersion,
  };
}

function getChannelScoresMap(raids: Raids) {
  const newChannelScoresMap: Record<string, number> = {};

  raids.incomingRaids.forEach((raid) => {
    if (!newChannelScoresMap[raid.fromTwitchChannel]) {
      newChannelScoresMap[raid.fromTwitchChannel] = 1;
    } else {
      newChannelScoresMap[raid.fromTwitchChannel] += 1;
    }
  });

  raids.outgoingRaids.forEach((raid) => {
    if (!newChannelScoresMap[raid.toTwitchChannel]) {
      newChannelScoresMap[raid.toTwitchChannel] = -1;
    } else {
      newChannelScoresMap[raid.toTwitchChannel] -= 1;
    }
  });

  return newChannelScoresMap;
}

function getChannelNames(raids: Raids, username: string) {
  const channelNamesSet = new Set<string>();

  [...raids.incomingRaids, ...raids.outgoingRaids].forEach((raid) => {
    channelNamesSet.add(raid.toTwitchChannel);
    channelNamesSet.add(raid.fromTwitchChannel);
  });

  channelNamesSet.delete(username);

  const newChannelNames = Array.from(channelNamesSet);

  return newChannelNames;
}

async function getStreamsMap(
  twitchAxios: AxiosInstance,
  newChannelNames: string[]
) {
  const batches = [];

  let sliced = newChannelNames.slice(0, 99);
  batches.push(sliced);
  let remainder = newChannelNames.slice(100);
  while (remainder?.length) {
    sliced = remainder.slice(0, 99);
    batches.push(sliced);
    remainder = remainder.slice(100);
  }

  const fetchedBatches = (
    await Promise.all(
      batches.map((batch) => {
        const joined = batch
          .map((streamName) => `user_login=${streamName}`)
          .join("&");
        return twitchAxios.get(`https://api.twitch.tv/helix/streams?${joined}`);
      })
    )
  ).map((response) =>
    response.data.data.map((channel: TwitchStream) => {
      channel.thumbnail_url = channel.thumbnail_url
        .replace("{width}", "200")
        .replace("{height}", Math.round((200 / 16) * 9) + "");

      return channel;
    })
  );

  const streams: TwitchStream[] = [];
  fetchedBatches.forEach((fetchedBatch) => {
    streams.push(...fetchedBatch);
  });

  const newStreamsMap: Record<string, TwitchStream> = {};
  streams.forEach((stream) => {
    newStreamsMap[stream.user_login] = stream;
  });

  return newStreamsMap;
}

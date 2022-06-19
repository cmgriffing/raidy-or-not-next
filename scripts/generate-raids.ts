import { createRaid } from "../server/repositories/raids";
import dayjs from "dayjs";
import Case from "case";
import {
  randUserName,
  randBoolean,
  seed,
  rand,
  randNumber,
} from "@ngneat/falso";
import { Raid } from "../types/models";
import { transformToData } from "../server/utils/knex";

seed("SOME_CONSTANT_VALUE");

const userId = "433913815";
const userName = "styrofoam_pad";

const raidUsers = [
  "Arbaya",
  "ticenl",
  "VATERZZ",
  "RipArtist",
  "abdoubentegar",
  "tinus_____",
  "Terrorflys",
  "Kugelnacht",
  "cmgriffing",
  "GriffingAndChill",
  "BernaWASD",
  "crutchcorn",
  "DonyellFreak",
  "TehBeardedGamer",
].map((name) => {
  return {
    twitch_id: `${randNumber({ min: 433000000, max: 434000000 })}`,
    twitch_name: name,
  };
});

const raids = new Array(60).fill("").map(() => {
  const randomUser = rand(raidUsers);

  const raidDate = randNumber({
    min: 1650497126,
    max: Math.round(Date.now() / 1000),
  });

  const newRaid: Partial<Raid> = {
    twitchId: userId,
    raidAmount: randNumber({ min: 10, max: 200 }),
    createdAt: raidDate,
    modifiedAt: raidDate,
    botVersion: "0.0.8",
  };

  if (randBoolean()) {
    newRaid.toTwitchChannel = userName;
    newRaid.fromTwitchChannel = randomUser.twitch_name;
  } else {
    newRaid.fromTwitchChannel = userName;
    newRaid.toTwitchChannel = randomUser.twitch_name;
  }

  return newRaid as Raid;
});

async function main() {
  await Promise.all(raids.map(createRaid));
}

main().then(() => {
  process.exit();
});

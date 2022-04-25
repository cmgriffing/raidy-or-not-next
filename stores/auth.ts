import { createState } from "@hookstate/core";
import { Persistence } from "@hookstate/persistence";

export const $authToken = createState("");

export const $twitchToken = createState("");

if (process.browser) {
  $authToken.attach(Persistence("authToken"));
  $twitchToken.attach(Persistence("twitchToken"));
}

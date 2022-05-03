export interface PostRaidRequest {
  /**
   * The channel that was raided.
   *
   * @minLength 1
   * @maxLength 32
   */
  toTwitchChannel: string;

  /**
   * The channel that did the raiding
   *
   * @minLength 1
   * @maxLength 32
   */
  fromTwitchChannel: string;

  /**
   * The amount of viewers in the raid
   *
   * @minimum 0
   */
  raidAmount: number;

  /**
   * The version of the bot that reported the raid.
   *
   * @minLength 1
   * @maxLength 32
   */
  botVersion: string;
}

export interface PostLoginRequest {
  /**
   * The OAuth code from twitch
   *
   * @minLength 1
   * @maxLength 50
   */
  code: string;
}

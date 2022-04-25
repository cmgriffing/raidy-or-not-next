export function TwitchButton() {
  const queryParams = new URLSearchParams();

  queryParams.append("response_type", "code");
  queryParams.append(
    "client_id",
    process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || ""
  );
  queryParams.append(
    "redirect_uri",
    process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URL || ""
  );
  queryParams.append(
    "scope",
    ["user:read:follows", "user:read:email"].join(" ")
  );

  const twitchLoginUrl = `https://id.twitch.tv/oauth2/authorize?${queryParams.toString()}`;

  return (
    <a
      className="p-button no-underline w-40 justify-center"
      href={twitchLoginUrl}
    >
      Login
    </a>
  );
}

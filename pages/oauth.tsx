import router from "next/router";
import { useEffect } from "react";
import { $authToken, $twitchToken } from "../stores/auth";
import { ApiPath } from "../types/api";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";

export default function Oauth() {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    axios
      .post("/api/" + ApiPath.Login, {
        code: queryParams.get("code") || "",
      })
      .then((loginResponse) => {
        const { authToken, twitchToken } = loginResponse.data;

        console.log({ authToken, twitchToken });

        $authToken.set(authToken);
        $twitchToken.set(twitchToken);

        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      });
  }, []);

  return (
    <div>
      <h2 className="text-6xl font-bold text-center mt-40">Logging in...</h2>
      <div className="text-center mt-4">
        <ProgressSpinner
          strokeWidth="20"
          fill="var(--surface-ground)"
          className="mx-auto"
        />
      </div>
    </div>
  );
}

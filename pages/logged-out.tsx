import { useEffect } from "react";
import { TwitchButton } from "../components/TwitchButton";
import { $authToken, $twitchToken } from "../stores/auth";
import { Card } from "primereact/card";

export default function LoggedOut() {
  useEffect(() => {
    $authToken.set("");
    $twitchToken.set("");
  }, []);

  return (
    <div className="flex items-center justify-center flex-1">
      <Card className="mt-8" title={<h2>You have been logged out.</h2>}>
        <div className="text-center">
          <p className="mb-4">
            If you would like to log in again, click the button below
          </p>
          <TwitchButton />
        </div>
      </Card>
    </div>
  );
}

import { Password, PasswordProps } from "primereact/password";
import { useEffect, useState } from "react";

interface ReadonlyPasswordProps extends PasswordProps {
  password: string;
}

export function ReadonlyPassword(props: ReadonlyPasswordProps) {
  const { password } = props;

  const [internalPassword, setInternalPassword] = useState(password);

  useEffect(() => {
    setInternalPassword(password);
  }, [password]);

  return (
    <Password
      {...props}
      value={internalPassword}
      onChange={() => {
        setInternalPassword(password);
      }}
    />
  );
}

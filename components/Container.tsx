import { PropsWithChildren } from "react";

export function Container({ children }: PropsWithChildren<{}>) {
  return (
    <div className="sm:w-[640px] md:w-[768px] lg:w-[1024px] xl:w-[1280px] xl2:w-[1536px] max-w-full mx-auto">
      {children}
    </div>
  );
}

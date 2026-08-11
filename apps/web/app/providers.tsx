"use client";

import { ReactNode, useState } from "react";
import { Store } from "./stores";
import { Provider } from "react-redux";

export const Providers = ({ children }: { children: ReactNode }) => {
  const [store] = useState(Store);

  return <Provider store={store}>{children}</Provider>;
};

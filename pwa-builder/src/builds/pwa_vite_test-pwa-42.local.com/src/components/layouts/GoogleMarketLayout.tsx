import type { ReactNode } from "react";

import MarketHeader from "../market/google/MarketHeader";

interface GoogleMarketLayoutProps {
  children: ReactNode;
}

const GoogleMarketLayout = ({ children }: GoogleMarketLayoutProps) => {
  return (
    <main className="max-w-screen-xl w-full mx-auto px-4 sm:px-8 lg:px-16">
      <MarketHeader />
      {children}
    </main>
  );
};

export default GoogleMarketLayout;

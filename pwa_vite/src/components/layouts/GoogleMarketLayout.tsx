import type { ReactNode } from "react";
import GoogleMarketHeader from "../markets/google/Header";

interface GoogleMarketLayoutProps {
  children: ReactNode;
}

const GoogleMarketLayout = ({ children }: GoogleMarketLayoutProps) => {
  return (
    <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-16">
      <GoogleMarketHeader />
      {children}
    </main>
  );
};

export default GoogleMarketLayout;

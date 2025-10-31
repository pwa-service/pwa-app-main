import type { ReactNode } from "react";

interface IAppleMarketLayoutProps {
  children: ReactNode;
}

const AppleMarketLayout = ({ children }: IAppleMarketLayoutProps) => {
  return (
    <main className="max-w-screen-lg w-full mx-auto p-4 sm:p-8 xl:p-16">
      {children}
    </main>
  );
};

export default AppleMarketLayout;

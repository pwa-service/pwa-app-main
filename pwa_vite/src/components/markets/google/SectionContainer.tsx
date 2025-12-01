import { type ReactNode } from "react";

interface SectionContainerProps {
  title: string;
  children: ReactNode;
}

const SectionContainer = ({ title, children }: SectionContainerProps) => {
  return (
    <section className="pt-5 space-y-5 mb-4">
      <h3 className="text-2xl font-medium">{title}</h3>
      {children}
    </section>
  );
};

export default SectionContainer;

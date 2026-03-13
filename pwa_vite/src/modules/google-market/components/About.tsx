import { getPWAData } from "../../../helpers/getPWAData";

const About = () => {
  return (
    <ul className="flex flex-col gap-5">
      {[getPWAData("description")].map((row, index) => (
        <li key={index}>
          <p className="text-zinc-600">
            {row.split("\n").map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default About;

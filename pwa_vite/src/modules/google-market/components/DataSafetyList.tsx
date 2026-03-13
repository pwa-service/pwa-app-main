import { MdOutlineShare, MdOutlineCloudDownload, MdLockOutline } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";

const DataSafetyList = () => {
  return (
    <ul className="flex flex-col gap-4 px-6 py-5 border border-zinc-300 rounded-lg text-zinc-600 leading-none">
      <li>
        <div className="flex items-center gap-4">
          <MdOutlineShare className="h-5 w-5" />

          <div className="flex flex-col">
            <span>This app may share these data types with third parties</span>
            <span className="text-sm">Financial info and Calendar</span>
          </div>
        </div>
      </li>

      <li>
        <div className="flex items-center gap-4">
          <MdOutlineCloudDownload className="h-5 w-5" />

          <div className="flex flex-col">
            <span>No data collected</span>

            <span className="text-sm">
              <a
                href="https://support.google.com/googleplay/answer/11416267?hl=en&visit_id=638999401320028096-2643835390&p=data-safety&rd=1"
                target="_blank"
                className="underline"
                aria-label="Learn more about Google Play data safety policy"
              >
                Learn more
              </a>{" "}
              about how developers declare collection
            </span>
          </div>
        </div>
      </li>

      <li>
        <div className="flex items-center gap-4">
          <MdLockOutline className="h-5 w-5" />
          <span>Data is encrypted in transit</span>
        </div>
      </li>

      <li>
        <div className="flex items-center gap-4">
          <LuTrash2 className="h-5 w-5" />
          <span>You can request that data be deleted</span>
        </div>
      </li>
    </ul>
  );
};

export default DataSafetyList;

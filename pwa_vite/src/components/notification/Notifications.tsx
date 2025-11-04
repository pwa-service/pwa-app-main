import { useEffect } from "react";
import { toast } from "react-toastify";
import { onMessageListener } from "../../firebase/config";

const Notifications = () => {
  useEffect(() => {
    onMessageListener((payload) => {
      toast(
        <div className="flex flex-col">
          <span className="font-semibold">{payload.notification?.title}</span>
          <span className="text-[12px]">{payload.notification?.body}</span>
        </div>
      );
    });
  }, []);

  return null;
};

export default Notifications;

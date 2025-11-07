import { useEffect } from "react";
import { copyToClipboard } from "../helpers/copyToClipboard";
import { usePushNotifications } from "../hooks/usePushNotifications";

import { ToastContainer } from "react-toastify";
import Notifications from "../components/notification/Notifications";
import SubscribeButton from "../components/notification/SubscribeButton";
import Card from "../ui/Card";

const ProductPage = () => {
  const { state, getToken, toggleSubscription } = usePushNotifications();

  useEffect(() => {
    getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-screen-2xl w-full mx-auto p-4">
      <ToastContainer hideProgressBar />
      <Notifications />

      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">PRODUCT PAGE</h1>

        <SubscribeButton
          loading={state.loading}
          token={state.token}
          toggleSubscription={toggleSubscription}
        />

        <div className="max-w-[400px] w-full flex flex-col gap-2">
          <span>FCM TOKEN: </span>

          {state.token && (
            <Card
              onClick={() => copyToClipboard(state.token!)}
              className="border-2 border-blue-300 bg-blue-100 cursor-pointer"
            >
              <span className="break-all">{state.token}</span>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductPage;

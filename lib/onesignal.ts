import OneSignal from "react-onesignal";

export default async function runOneSignal() {
  await OneSignal.init({
    appId: "a048564d-ce47-464a-be18-815088ddc93b",
    allowLocalhostAsSecureOrigin: true,
    serviceWorkerParam: { scope: "/notifications/onesignal/" },
    serviceWorkerPath: "/notifications/onesignal/OneSignalSDKWorker.js",
  });
  OneSignal.Slidedown.promptPush();
}

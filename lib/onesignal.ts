import OneSignal from "react-onesignal";

export default async function runOneSignal() {
  await OneSignal.init({
    appId: "a048564d-ce47-464a-be18-815088ddc93b",
    safari_web_id: "web.onesignal.auto.1b5e3a9a-fd8d-4cbc-b150-cc0a98b0f0fe",
    allowLocalhostAsSecureOrigin: true,
    serviceWorkerParam: { scope: "/notifications/onesignal/" },
    serviceWorkerPath: "/notifications/onesignal/OneSignalSDKWorker.js",
  });

  await OneSignal.Slidedown.promptPush();
}

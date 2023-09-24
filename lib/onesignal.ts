import OneSignal from "react-onesignal";

export default async function runOneSignal() {
  await OneSignal.init({
    appId: "a048564d-ce47-464a-be18-815088ddc93b",
  });

  await OneSignal.Slidedown.promptPush();
}

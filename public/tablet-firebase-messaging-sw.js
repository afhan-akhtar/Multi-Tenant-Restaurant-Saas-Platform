/* eslint-disable no-undef */
/**
 * Placeholder FCM service worker for the tableside PWA shell.
 * Replace with Firebase-generated worker after adding your Firebase config
 * and registering the app in Firebase Console (FCM).
 *
 * See: https://firebase.google.com/docs/cloud-messaging/js/client
 */
self.addEventListener("push", (event) => {
  const data = event.data?.json?.() || {};
  const title = data.notification?.title || "Order update";
  const body = data.notification?.body || "";
  event.waitUntil(self.registration.showNotification(title, { body }));
});

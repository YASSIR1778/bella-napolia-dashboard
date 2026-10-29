// Shows the owner's notifications on their phone (the agent team's, the
// café's alerts, a guest's drink asked from the till), and opens the
// dashboard's agent inbox when one is tapped: the guest request bar shows on
// every page.
self.addEventListener('push', (event) => {
  let msg = { title: 'Bella Napolia', body: '' };
  try {
    msg = { ...msg, ...event.data.json() };
  } catch {
    if (event.data) msg.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(msg.title, {
      body: msg.body,
      icon: 'icon-256.png',
      badge: 'icon-256.png',
      dir: 'auto',
      lang: 'ar',
      tag: msg.title,
      // A second request with the same title still rings, not only replaces the first.
      renotify: true,
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL('./?page=agent', self.registration.scope).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const open = list.find((c) => c.url.startsWith(self.registration.scope));
      if (open) {
        open.navigate(url);
        return open.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});

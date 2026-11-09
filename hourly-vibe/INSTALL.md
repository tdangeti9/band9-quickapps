# Install Hourly on Xiaomi Smart Band 9

Debug package: `dist/com.hourly.vibe.debug.1.1.0.rpk` (attached on the issue).

## Behavior

| Event | Action |
|-------|--------|
| On the hour (`:00`) | ~2s haptic (5× `long` pulses), then stop |
| After fire | No snooze / no “Later” / no 10‑minute re-fire |
| **ON/OFF** | Arms or disarms |
| **BG audio** | Muted looping keepalive via `system.audio` so Vela may keep the app alive after you leave to the watchface |
| **Test vibe** | Same ~2s pattern immediately |

## How to use (leave-app mode)

1. Open **Hourly** → leave **ON** and **BG audio: ON**.
2. Status should become **Armed (BG)** (or similar).
3. Press home / open watchface / steps as usual — do **not** force-stop the app.
4. At `:00` the band should vibe once and stay quiet until the next hour.

If status shows **Audio BG failed** or vibes stop after leaving, Band 9 rejected background audio — use the phone path below.

## Why this approach

Vela only allows background for `system.audio` / `system.request` / `system.geolocation`. Timers in a page die when the page is destroyed. v1.1 moves the scheduler into `app.ux` and holds a muted audio loop so the process stays eligible to run after you leave the UI.

This is still not a guaranteed OS daemon. Battery cost is higher than a stock alarm while BG audio is running.

## Phone fallback (reliable if BG audio fails)

Use a **notification** (not a band alarm) so the band vibes once with no snooze loop:

### Android

1. Install [Notify for Xiaomi / Mi Band 8–10](https://play.google.com/store/apps/details?id=com.mc.xiaomi1) **or** keep Mi Fitness for notifications.
2. Create an **hourly repeating reminder / notification** (Notify “custom repeated reminders”, or Tasker/MacroDroid → notify at `:00`).
3. In Mi Fitness: Device → Notifications → allow the notifier app; set a ~2s custom vibration pattern for notifications if you want.
4. Keep Bluetooth + Mi Fitness (or Notify) allowed to run in background.

### iPhone

1. Shortcuts → Automation → Time of Day → **Hourly** (or every hour in your wake window).
2. Action: Show Notification (or Calendar alert that Mi Fitness mirrors).
3. Mi Fitness → Notifications enabled for that source.
4. Ignoring the band alert does **not** start a 10‑minute Later loop (unlike stock band alarms).

## Sideload (AstroBox + AuthKey)

Same path as the japa counter (MACW-11):

1. Use the attached **debug** `.rpk`.
2. Force-stop **Mi Fitness** on the phone.
3. Open [AstroBox](https://astrobox.online/), connect Band 9 (Xiaomi login / AuthKey).
4. Push `com.hourly.vibe.debug.1.1.0.rpk`.
5. Open **Hourly** → ON + BG audio → leave to home and verify next `:00` (or Test vibe first).

## Rebuild

```bash
cd hourly-vibe
npm install
npm run build
```

Output: `dist/com.hourly.vibe.debug.<version>.rpk`

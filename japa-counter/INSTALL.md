# Install Japa on Xiaomi Smart Band 9

Debug package: `dist/com.japa.counter.debug.1.5.4.rpk` (also in repo `releases/`).

## Behavior

| Control | Action |
|---------|--------|
| Large center tap | +1 bead |
| At 108 | mala +1, beads → 0 (stronger haptic) |
| Hold Reset 4s (bottom) | red bar fills L→R; clears beads + mala when full. Release early = cancel |

Counts persist across app reopen.

## Sideload (AstroBox + AuthKey)

1. Build is already done — use the attached `.rpk` (must be a **debug** build, not release).
2. On the phone: **force-stop Mi Fitness** / 小米运动健康 so it does not hold the band’s BLE link (avoids GATT 133).
3. Open [AstroBox](https://astrobox.online/) (desktop, mobile, or web with WebBluetooth).
4. Connect the Band 9:
   - Prefer **Xiaomi account login** so AstroBox pulls the device **AuthKey**, or
   - Enter the AuthKey manually if you already have it.
5. On the band, accept the pairing / “connect new phone” prompt if asked.
6. In AstroBox → install / push quick app → select `com.japa.counter.debug.1.5.4.rpk` → push.
7. On the band: open the app list → **Japa** → tap the center to count.

## Troubleshooting

- **Won’t connect / GATT 133**: force-stop Mi Fitness again; toggle phone Bluetooth; retry.
- **AuthKey invalid**: re-login Xiaomi account in AstroBox after rebinding the band.
- **Install rejected / cert error**: use the debug `.rpk` from `npm run build`, not `npm run release`.
- **Update doesn’t show**: bump `versionCode` / `versionName` in `src/manifest.json`, rebuild, reinstall.

## Rebuild

```bash
cd japa-counter
npm install
npm run build
```

Output: `dist/com.japa.counter.debug.<version>.rpk`

/**
 * Force system brightness up. Never dim.
 *
 * v1.5.0 setValue(1) stuck Band 9 near-black. v1.5.2 called
 * systembrightnessrecovery() then setMode(1=auto) before setValue —
 * recovery can re-apply the stuck level, and auto mode ignores setValue.
 * Here: manual mode first, then max brightness (repeated).
 */
function restoreSystemBrightness() {
  try {
    var brightness = require('@system.brightness')

    // Manual mode so setValue is honored
    try {
      brightness.setMode({ mode: 0 })
    } catch (e0) {}

    function bump() {
      try {
        brightness.setValue({ value: 255 })
      } catch (e1) {}
    }

    bump()
    // Second/third pass in case the first write races with wake
    try {
      setTimeout(bump, 80)
      setTimeout(bump, 250)
      setTimeout(bump, 600)
    } catch (e2) {
      bump()
    }

    try {
      brightness.setKeepScreenOn({ keepScreenOn: true })
    } catch (e3) {}
  } catch (e) {}
}

module.exports = {
  restoreSystemBrightness: restoreSystemBrightness
}

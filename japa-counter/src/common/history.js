var DAY_KEY = 'japa_day_key'
var BEADS_KEY = 'japa_beads'
var MALA_KEY = 'japa_mala'
var HIST_KEY = 'japa_history'

function pad2(n) {
  return n < 10 ? '0' + n : String(n)
}

function formatDayKey(d) {
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
}

/** Japa-day key: a "day" runs 05:00 → next 05:00. */
function japaDayKey(now) {
  var d = new Date(now.getTime())
  if (d.getHours() < 5) {
    d.setDate(d.getDate() - 1)
  }
  return formatDayKey(d)
}

function parseDayKey(key) {
  var p = key.split('-')
  return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10), 12, 0, 0)
}

function addDays(key, delta) {
  var d = parseDayKey(key)
  d.setDate(d.getDate() + delta)
  return formatDayKey(d)
}

function monthKeyFromDay(dayKey) {
  return dayKey.slice(0, 7)
}

function emptyHistory() {
  return { days: {}, months: {} }
}

function ensureHistory(h) {
  if (!h || typeof h !== 'object') return emptyHistory()
  if (!h.days) h.days = {}
  if (!h.months) h.months = {}
  return h
}

function addTotals(into, beads, mala) {
  into.b = (into.b || 0) + (beads || 0)
  into.m = (into.m || 0) + (mala || 0)
}

/** Keep day detail for current month + last 14 japa-days; fold older into months. */
function pruneHistory(h, todayKey) {
  h = ensureHistory(h)
  var keepMonth = monthKeyFromDay(todayKey)
  var oldestKeep = addDays(todayKey, -13)
  var dayKeys = Object.keys(h.days)
  for (var i = 0; i < dayKeys.length; i++) {
    var k = dayKeys[i]
    var inWindow = k >= oldestKeep
    var inMonth = monthKeyFromDay(k) === keepMonth
    if (!inWindow && !inMonth) {
      var mk = monthKeyFromDay(k)
      if (!h.months[mk]) h.months[mk] = { b: 0, m: 0 }
      addTotals(h.months[mk], h.days[k].b, h.days[k].m)
      delete h.days[k]
    }
  }
  return h
}

function archiveDay(h, dayKey, beads, mala) {
  h = ensureHistory(h)
  if (!h.days[dayKey]) h.days[dayKey] = { b: 0, m: 0 }
  // Store end-of-day snapshot (overwrite with final totals for that day)
  h.days[dayKey] = { b: beads || 0, m: mala || 0 }
  return h
}

function weekIndexInMonth(dayKey) {
  var day = parseInt(dayKey.slice(8, 10), 10)
  return Math.floor((day - 1) / 7) + 1
}

/** Build display rows for history page. */
function buildHistoryRows(h, todayKey) {
  h = ensureHistory(h)
  var rows = []
  var i

  rows.push({ type: 'hdr', label: 'This / last week', value: '' })
  for (i = 0; i < 14; i++) {
    var dk = addDays(todayKey, -i)
    var t = h.days[dk] || { b: 0, m: 0 }
    if (i === 0 && t.b === 0 && t.m === 0) {
      // today still in progress — show placeholder; live totals passed separately
    }
    var short = dk.slice(5) // MM-DD
    var tag = i === 0 ? ' today' : ''
    rows.push({
      type: 'day',
      label: short + tag,
      value: t.m + 'm ' + t.b + 'b',
      key: dk
    })
  }

  rows.push({ type: 'hdr', label: 'This month / wk', value: '' })
  var curMonth = monthKeyFromDay(todayKey)
  var weeks = { 1: { b: 0, m: 0 }, 2: { b: 0, m: 0 }, 3: { b: 0, m: 0 }, 4: { b: 0, m: 0 }, 5: { b: 0, m: 0 } }
  var dks = Object.keys(h.days)
  for (i = 0; i < dks.length; i++) {
    if (monthKeyFromDay(dks[i]) !== curMonth) continue
    var wi = weekIndexInMonth(dks[i])
    addTotals(weeks[wi], h.days[dks[i]].b, h.days[dks[i]].m)
  }
  for (i = 1; i <= 5; i++) {
    if (weeks[i].b === 0 && weeks[i].m === 0 && i > 1) {
      // skip empty trailing weeks except show W1 always
      var later = false
      for (var j = i + 1; j <= 5; j++) {
        if (weeks[j].b || weeks[j].m) later = true
      }
      if (!later) continue
    }
    rows.push({
      type: 'week',
      label: 'W' + i,
      value: weeks[i].m + 'm ' + weeks[i].b + 'b'
    })
  }

  rows.push({ type: 'hdr', label: 'Past months', value: '' })
  var mks = Object.keys(h.months).sort().reverse()
  if (mks.length === 0) {
    rows.push({ type: 'month', label: '(none yet)', value: '' })
  } else {
    for (i = 0; i < mks.length; i++) {
      if (mks[i] === curMonth) continue
      rows.push({
        type: 'month',
        label: mks[i],
        value: h.months[mks[i]].m + 'm ' + h.months[mks[i]].b + 'b'
      })
    }
  }

  return rows
}

module.exports = {
  DAY_KEY: DAY_KEY,
  BEADS_KEY: BEADS_KEY,
  MALA_KEY: MALA_KEY,
  HIST_KEY: HIST_KEY,
  pad2: pad2,
  japaDayKey: japaDayKey,
  monthKeyFromDay: monthKeyFromDay,
  emptyHistory: emptyHistory,
  ensureHistory: ensureHistory,
  pruneHistory: pruneHistory,
  archiveDay: archiveDay,
  buildHistoryRows: buildHistoryRows,
  addDays: addDays
}

const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs   = require('fs');

// ── Auto-launch on system startup ─────────────────────────────────────────────
app.setLoginItemSettings({ openAtLogin: true, name: 'Daily Check-In' });

// ── Persistent data file ──────────────────────────────────────────────────────
const DATA_PATH = path.join(app.getPath('userData'), 'checkin-data.json');

function loadData() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('[main] Could not read data file:', err.message);
  }
  return {
    contacts:   [],
    dailyState: { date: '', todaysPeople: [], checkedOff: [] },
    settings:   { dailyCount: 3, corner: 'bottom-right', opacity: 1.0 },
  };
}

function saveData(payload) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2), 'utf8');
  } catch (err) {
    console.error('[main] Could not write data file:', err.message);
  }
}

// ── Window constants ──────────────────────────────────────────────────────────
const WIN_W      = 360;
const WIN_H_EXP  = 560;
const WIN_H_MINI = 56;
const MARGIN     = 16;

// Track current corner so set-window-height can reposition correctly
let currentCorner = 'bottom-right';

function calcPosition(h, corner) {
  const c = corner || currentCorner;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  switch (c) {
    case 'top-left':     return { x: MARGIN,                 y: MARGIN };
    case 'top-right':    return { x: width - WIN_W - MARGIN, y: MARGIN };
    case 'bottom-left':  return { x: MARGIN,                 y: height - h - MARGIN };
    default:             return { x: width - WIN_W - MARGIN, y: height - h - MARGIN };
  }
}

// ── Create window ─────────────────────────────────────────────────────────────
let win = null;

function createWindow() {
  const savedData   = loadData();
  const settings    = savedData.settings || {};
  currentCorner     = settings.corner  || 'bottom-right';
  const initOpacity = settings.opacity != null ? settings.opacity : 1.0;

  const { x, y } = calcPosition(WIN_H_EXP, currentCorner);

  win = new BrowserWindow({
    width:       WIN_W,
    height:      WIN_H_EXP,
    x, y,
    alwaysOnTop: true,
    frame:       false,
    resizable:   false,
    transparent: false,
    skipTaskbar: false,
    show:        false,
    opacity:     initOpacity,
    webPreferences: {
      preload:          path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration:  false,
    },
  });

  win.loadFile('index.html');
  win.once('ready-to-show', () => win.show());

  // Uncomment to debug:
  // win.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// ── IPC handlers ──────────────────────────────────────────────────────────────
ipcMain.handle('get-data', () => loadData());

ipcMain.handle('save-data', (_, payload) => {
  saveData(payload);
});

ipcMain.handle('set-window-height', (_, requestedHeight) => {
  if (!win) return;
  const h = Math.max(WIN_H_MINI, Math.min(requestedHeight, 800));
  const { x, y } = calcPosition(h);
  win.setSize(WIN_W, h, false);
  win.setPosition(x, y, false);
});

ipcMain.handle('set-corner', (_, corner) => {
  if (!win) return;
  currentCorner = corner;
  const [, h] = win.getSize();
  const { x, y } = calcPosition(h, corner);
  win.setPosition(x, y, false);
});

ipcMain.handle('set-opacity', (_, opacity) => {
  if (!win) return;
  win.setOpacity(Math.max(0.3, Math.min(1.0, opacity)));
});

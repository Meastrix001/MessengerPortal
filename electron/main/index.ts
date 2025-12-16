import { app, ipcMain, BrowserView } from "electron";
import { release } from "node:os";
import { join } from "node:path";

import { BrowserWindowsCustom } from "./browserWindow";
import { log } from "node:console";

log("HERE")
if (require("electron-squirrel-startup")) app.quit();

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.whenReady().then(() => {
  const win = new BrowserWindowsCustom();

  // Create BrowserView for Messenger
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  win.setBrowserView(view);

  // Set bounds to fill the window
  const { width, height } = win.getBounds();
  view.setBounds({ x: 0, y: 0, width, height: height - 32 });

  // Auto-resize when window resizes
  win.on('resize', () => {
    const { width, height } = win.getBounds();
    view.setBounds({ x: 0, y: 0, width, height: height - 32 });
  });

  // Load Messenger
  view.webContents.loadURL('https://www.messenger.com/');

  // Optional: Handle navigation
  view.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log('Failed to load:', errorCode, errorDescription);
  });

  ipcMain.setMaxListeners(100);
});
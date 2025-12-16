import { BrowserWindow } from "electron";
import { join } from "node:path";

interface IBrowserWindowsCustom {
  emitGameEvent: (event: EventType, payload: string | number | Object) => void;
  crashMode: () => void;
}
type EventType = "match-event" | "player-event" | "game-event";

export class BrowserWindowsCustom
  extends BrowserWindow
  implements IBrowserWindowsCustom {
  constructor(debugMode?: boolean) {

    const preload = join(__dirname, "../preload/index.js");
    const url = process.env.VITE_DEV_SERVER_URL;
    const indexHtml = join(process.env.DIST, "index.html");
    super({
      title: "messenger-portal",
      icon: join(__dirname, "assets", "icon.ico"),
      width: 1920,
      height: 1080,
      autoHideMenuBar: true, // 👈 THIS
      webPreferences: {
        preload,
        devTools: false,
        contextIsolation: false,
        nodeIntegration: true,
      },
    });

    if (!debugMode) {
      // this.removeMenu();
      // this.webContents.openDevTools();
    } else {
    }

    if (url) {
      this.loadURL(url);
    } else {
      this.loadFile(indexHtml);
    }
  }

  crashMode() { }

  emitGameEvent(event: EventType, payload: string | number | Object) {
    this.webContents.send(event, JSON.stringify(payload));
  }
}

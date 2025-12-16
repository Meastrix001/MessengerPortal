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
  constructor() {
    super({
      title: "messenger-portal",
      icon: join(__dirname, "assets", "icon.ico"),
      width: 1920,
      height: 1080,
      autoHideMenuBar: true, // 👈 THIS
      webPreferences: {
        devTools: false,
        contextIsolation: false,
        nodeIntegration: true,
      },
    });
  }

  crashMode() { }

  emitGameEvent(event: EventType, payload: string | number | Object) {
    this.webContents.send(event, JSON.stringify(payload));
  }
}

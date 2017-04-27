import { Client } from "../client";
import { config } from "../config"
import * as utils from "../utils";

/**
 * Form
 */
export class Form {
  private client: Client;
  private proxy:  any;

  constructor(client: Client, proxy: any) {
    this.client = client;
    this.proxy  = proxy;

    window.addEventListener("message", (function (_this: Form) {
      return function (event: MessageEvent) {
        return utils.applyMessage(_this, event);
      };
    })(this), false);
  }

  public closeFrame(closeFrameTimeout: number = 0) {
    this.postMessage({ action: "close", args: [closeFrameTimeout] });
  }

  public sendTokenAndCloseFrame(token: string, note: string) {
    this.postMessage({ action: "submitTokenAndClose", args: [token, note] });
  }

  public openAndConfigure(configuration: Object) {
    this.proxy.openAndConfigure(configuration);
  }

  private postMessage(data: Object) {
    utils.postMessage(parent.window, data, "*")
  }
}

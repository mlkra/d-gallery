import { Injectable } from '@angular/core';
import { TriggerController } from '../interface/trigger-controller';

@Injectable({
  providedIn: 'root'
})
export class TriggerButtonService implements TriggerController {
  triggerEnabled: boolean;
  triggerDownload: boolean;

  constructor() { }

  initTrigger() {
    setTimeout(() => {
      this.triggerEnabled = true;
    });
    this.triggerDownload = false;
  }

  trigger() {
    if (this.triggerEnabled) {
      this.triggerDownload = true;
    }
  }
}

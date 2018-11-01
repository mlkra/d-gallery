import { Component, OnInit } from '@angular/core';
import { TriggerButtonService } from '../service/trigger-button.service';

@Component({
  selector: 'app-trigger-button',
  templateUrl: './trigger-button.component.html',
  styleUrls: ['./trigger-button.component.css']
})
export class TriggerButtonComponent implements OnInit {

  constructor(private triggerButtonService: TriggerButtonService) { }

  ngOnInit() {
  }

  enabled() {
    return this.triggerButtonService.triggerEnabled;
  }

  triggered() {
    this.triggerButtonService.trigger();
  }
}

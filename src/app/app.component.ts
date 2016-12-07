import { Component } from '@angular/core';


declare var ffFlyItems: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class AppComponent {

  public svgArr: any = [
    'resources/svg/1.svg',
    'resources/svg/2.svg',
    'resources/svg/3.svg',
    'resources/svg/4.svg',
    'resources/svg/5.svg',
    'resources/svg/6.svg'
  ];
  public flyGuitars: any;

  ngOnInit(){
    this.flyGuitars = new ffFlyItems('ffFlyItem', this.svgArr);
  }

  onResize(event) {
    this.flyGuitars.resize();
  }

}

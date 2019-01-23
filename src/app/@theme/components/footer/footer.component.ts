import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by"
      >Created with ♥ by <b><a href="https://github.com/zlq4863947" target="_blank">zlq4863947</a></b> 2018</span
    >
    <div class="socials">
      <a href="#" class="ion ion-social-github"></a>
      <a href="#" class="ion ion-social-facebook"></a>
      <a href="#" class="ion ion-social-twitter"></a>
      <a href="#" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {}

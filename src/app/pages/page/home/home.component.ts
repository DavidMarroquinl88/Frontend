import { Component } from '@angular/core';
import { MainComponent } from '../../components/main/main.component';
import { AsideComponent } from '../../components/aside/aside.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'pages-home',
  imports: [AsideComponent, FooterComponent, HeaderComponent, MainComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

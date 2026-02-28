import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation-panel',
  imports: [RouterLink],
  templateUrl: './navigation-panel.html',
  styleUrl: './navigation-panel.scss',
})
export class NavigationPanel {
  routingButtons = signal([
    {
      rout: "/login",
      text: "Login",
      image: "",
    },
    {
      rout: "/products",
      text: "Products",
      image: "",
    }
  ])
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  user$: Observable<string>;

  constructor(private authService: AuthService, private router: Router, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.user$ = this.store.select('auth')
              .pipe(
                filter(({user}) => user != null),
                map(({user}) => user.nombre)
              )
  }

  logOut = async () => {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

}

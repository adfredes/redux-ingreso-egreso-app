import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):Observable<boolean> {      
      return this.authService.isAuth()
                .pipe(
                  tap( estado => {
                    if (!estado) { this.router.navigate(['/login']); }
                  })
                );
  }

  canLoad(): Observable<boolean>{
    return this.authService.isAuth()
                .pipe(
                  take(1),
                  tap( estado => {
                    if (!estado) { this.router.navigate(['/login']); }
                  })
                );
  }
  
}

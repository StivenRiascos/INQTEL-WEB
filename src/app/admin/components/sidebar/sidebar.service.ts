import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // Estado inicial: abierto en desktop, cerrado en móvil
  private _isExpanded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    window.innerWidth >= 768
  );
  public isExpanded$: Observable<boolean> = this._isExpanded.asObservable();

  public get isExpanded(): boolean {
    return this._isExpanded.value;
  }

  public toggleSidebar(): void {
    this._isExpanded.next(!this._isExpanded.value);
  }

  public closeSidebar(): void {
    if (window.innerWidth < 768) {
      this._isExpanded.next(false);
    }
  }
}

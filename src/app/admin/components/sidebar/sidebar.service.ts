import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _isExpanded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    window.innerWidth >= 768
  );

  private _isCollapsed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public isExpanded$: Observable<boolean> = this._isExpanded.asObservable();
  public isCollapsed$: Observable<boolean> = this._isCollapsed.asObservable();

  public get isExpanded(): boolean {
    return this._isExpanded.value;
  }

  public get isCollapsed(): boolean {
    return this._isCollapsed.value;
  }

  public toggleSidebar(): void {
    this._isExpanded.next(!this._isExpanded.value);
  }

  public closeSidebar(): void {
    if (window.innerWidth < 768) {
      this._isExpanded.next(false);
    }
  }

  public toggleCollapsed(): void {
    this._isCollapsed.next(!this._isCollapsed.value);
  }

  public setCollapsed(state: boolean): void {
    this._isCollapsed.next(state);
  }
}

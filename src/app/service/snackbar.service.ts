import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilityService } from './utility.service';
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private _snackBar: MatSnackBar,
    private utilityService: UtilityService
  ) { }

    showSuccessSnackbar(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message: message,
        iconPath: 'assests/icon/snackbar/success.png',
      },
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: 'snackbar-successs',
    });
  }

  showInfoSnackbar(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message: message,
        iconPath: 'assests/icon/snackbar/info.png',
      },
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: 'snackbar-info',
    });
  }

  showErrorMessageSnackbar(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message: message,
        iconPath: 'assests/icon/snackbar/error.png',
      },
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: 'snackbar-error',
    });
  }

  showErrorSnackbar(error: any) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message: this.utilityService.getErrorString(error),
        iconPath: 'assests/icon/snackbar/error.png',
      },
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: 'snackbar-error',
    });
  }
}

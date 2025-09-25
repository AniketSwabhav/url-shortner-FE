import { Injectable } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  readonly NAVIGATION_HISTORY = "navigation-history"

  constructor(
    private router: Router,
    private location: Location
  ) { }


  //===========================================================================
  getPaginationString(limit: number, offset: number, totalCount: number): string {
    if (limit == -1) {
      limit = totalCount
    }

    let start: number = limit * offset + 1
    let end: number = +limit + limit * offset

    if (totalCount < end) {
      end = totalCount
    }
    if (totalCount == 0) {
      return ""
    }

    if (start > end) {
      return `${end} - ${end}`
    }

    return `${start} - ${end}`
  }

   getErrorString(err: any): string {
    if (navigator.onLine) {
      if (err?.statusText && err?.statusText.toLowerCase() === 'unknown error') {
        return "Please Check your Internet Connection"
      }

      if (typeof err == 'object') {
        if (typeof err.error == 'object') {
          if (typeof err.error.message == 'string') {
            return err.error.message
          }

          if (typeof err.error.error == 'string') {
            return err.error.error
          }

          if (typeof err.error.message == undefined) {
            return "Something wrong Please try later"
          }
        }

        if (typeof err.error == 'string') {
          return err.error
        }

        if (typeof err.message == 'string') {
          return err.message
        }
      }

      return err
    }

    return "Please Check your Internet Connection"
  }

}
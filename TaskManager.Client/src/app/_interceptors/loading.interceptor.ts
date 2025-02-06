import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../_services/loading.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.busy();

  return next(req).pipe(
    delay(450),
    finalize(() => {
      loadingService.idle();
    }),
  );
  // const loadingService = inject(LoadingService);

  // // Start a timer to track the request duration
  // const startTime = Date.now();

  // // Call the next interceptor or API request
  // return next(req).pipe(
  //   tap(() => {
  //     // Calculate the request duration
  //     const duration = Date.now() - startTime;

  //     // If the request takes longer than 0.5 seconds, show the spinner
  //     if (duration > 500) {
  //       loadingService.busy();
  //     }
  //   }),
  //   finalize(() => {
  //     // Hide the spinner once the request is complete
  //     loadingService.idle();
  //   }),
  //   catchError((error) => {
  //     // Ensure spinner hides on error as well
  //     loadingService.idle();
  //     return throwError(error);
  //   })
  // );
};

import { Logger } from "@nestjs/common"
import { catchError, Observable, of, OperatorFunction, throwError, timer } from "rxjs"
import { retry } from 'rxjs/operators';
import { CustomCatchOperatorResponse } from "./interface/exception-operator.interface";

export const customCatchOperator = (logger: Logger): OperatorFunction<any, any> => {
  return (source: Observable<any>) => source.pipe(
    retry({
      count: 3,
      delay: (error, retryAttempt) => {
        if ((error.code == 'ECONNREFUSED' && (!error.config?.timeout || error.config?.timeout > 2000)) || error.code == 'ETIMEDOUT') {
          logger.log(`Tentativa ${retryAttempt}: tentando novamente em ${retryAttempt * 3}s`);

          return timer(retryAttempt * 5000);
        } else {
          return throwError(() => error);
        }
      }
    }),
    catchError((err: any): Observable<CustomCatchOperatorResponse> => {
      const error = err?.response?.data ? JSON.stringify(err.response.data) : err
      const errorMessage = `Ocorreu um erro na chamada de API(${err?.request?._redirectable?._options?.pathname || err?.request?.path}): ${error}`

      const response = {
        data: {
          error: err?.response?.data || err?.toString()
        }
      }

      if (err?.code !== 'ECONNABORTED') {
        if (!err?.response || err?.response?.status >= 500)
          logger.error(!err?.response ? err?.cause?.stack : errorMessage)
        else
          logger.warn(errorMessage)
      }

      return of(response)
    })
  );
}

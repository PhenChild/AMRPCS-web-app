import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpSpinnerInterceptor } from "./http-interceptor";

export const httpInterceptProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpSpinnerInterceptor, multi: true }
]
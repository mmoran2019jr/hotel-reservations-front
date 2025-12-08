import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
//Utilizamos nuestra clase jwt para validacion de tokens en las peticiones http
@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule | null) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in AppModule only.');
    }
  }
}

// src/app/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'assets/products.json'; // Ruta correcta al archivo JSON
  private productsCache$: Observable<any[]>;

  constructor(private http: HttpClient) {
    // Inicializar el cache
    this.productsCache$ = this.http.get<any[]>(this.apiUrl).pipe(
      shareReplay(1), // Mantiene una sola copia en caché
      catchError(this.handleError<any[]>('getProducts', []))
    );
  }

  getProducts(): Observable<any[]> {
    return this.productsCache$;
  }

  getProduct(id: string): Observable<any> {
    return this.getProducts().pipe(
      map(products => products.find(product => product.id === id)),
      catchError(this.handleError<any>('getProduct'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

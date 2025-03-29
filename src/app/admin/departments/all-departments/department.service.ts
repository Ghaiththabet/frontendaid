import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Department } from './department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly API_URL = 'assets/data/department.json';
  dataChange: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>(
    []
  );

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all departments */
  getAllDepartments(): Observable<Department[]> {
    return this.httpClient
      .get<Department[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new department */
  addDepartment(department: Department): Observable<Department> {
    return this.httpClient.post<Department>(this.API_URL, department).pipe(
      map((response) => {
        return department; // return department from API
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing department */
  updateDepartment(department: Department): Observable<Department> {
    return this.httpClient.put<Department>(`${this.API_URL}`, department).pipe(
      map((response) => {
        return department; // return department from API
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a department by ID */
  deleteDepartment(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // return the ID of the deleted department
      }),
      catchError(this.handleError)
    );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}

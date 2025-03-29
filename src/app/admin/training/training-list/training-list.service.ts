import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainerInfo } from './training-list.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingListService {
  private readonly API_URL = 'http://localhost:8083/api/trainings/with-participants';

  constructor(private http: HttpClient) {}

  getAllTrainersWithTrainings(): Observable<TrainerInfo[]> {
    return this.http.get<TrainerInfo[]>(this.API_URL);
  }
}

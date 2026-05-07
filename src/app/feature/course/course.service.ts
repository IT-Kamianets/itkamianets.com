import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@wawjs/ngx-http';

const API_BASE = '/api/itcourse';

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private http: HttpService) {}

  getCourses(): Observable<any> {
    return this.http.get(`${API_BASE}/get`);
  }

  fetchCourse(id: string): Observable<any> {
    return this.http.post(`${API_BASE}/fetch`, { _id: id });
  }

  createCourse(data: any): Observable<any> {
    return this.http.post(`${API_BASE}/create`, { data });
  }

  updateCourse(id: string, data: any): Observable<any> {
    return this.http.post(`${API_BASE}/update`, { _id: id, data });
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.post(`${API_BASE}/delete`, { _id: id });
  }
}

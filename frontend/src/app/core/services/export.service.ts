import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private apiUrl = `${environment.apiUrl}/export`;

  constructor(private http: HttpClient) {}

  exportToCSV(startDate?: string, endDate?: string): Observable<Blob> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get(`${this.apiUrl}/csv`, {
      params,
      responseType: 'blob',
    });
  }

  exportToPDF(startDate?: string, endDate?: string): Observable<Blob> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get(`${this.apiUrl}/pdf`, {
      params,
      responseType: 'blob',
    });
  }

  downloadFile(blob: Blob, filename: string): void {
    if (blob.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const error = JSON.parse(reader.result as string);
          console.error('Export failed:', error);
          alert(`Export failed: ${error.message || 'Unknown error'}`);
        } catch (e) {
          console.error('Error parsing error response:', e);
          alert('Export failed with an unknown error.');
        }
      };
      reader.readAsText(blob);
      return;
    }

    // Determine mime type based on filename
    const extension = filename.split('.').pop()?.toLowerCase();
    let type = 'application/octet-stream';
    if (extension === 'pdf') type = 'application/pdf';
    if (extension === 'csv') type = 'text/csv';

    const newBlob = new Blob([blob], { type });
    const url = window.URL.createObjectURL(newBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none'; // Hide the link
    document.body.appendChild(link); // Append to body (required for some browsers)
    
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}

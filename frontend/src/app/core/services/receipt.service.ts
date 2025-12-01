import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Receipt {
  _id: string;
  userId: string;
  transactionId?: string;
  imageUrl: string;
  merchant?: string;
  notes?: string;
  uploadDate: Date;
  isProcessed: boolean;
  ocrData?: {
    extractedText?: string;
    confidence?: number;
    processedAt?: Date;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private apiUrl = `${environment.apiUrl}/receipts`;

  constructor(private http: HttpClient) {}

  getReceipts(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getReceipt(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  uploadReceipt(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  processOCR(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/process`, {});
  }

  updateReceipt(id: string, receipt: Partial<Receipt>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, receipt);
  }

  deleteReceipt(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

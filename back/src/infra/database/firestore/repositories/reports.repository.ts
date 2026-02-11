import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../firestore.service";
import { Report, UpdateReport } from "../types/reports.type";
import { modelReport } from "../mappers/reports.mapper";
import { GetReportDto } from "src/infra/http/reports/dto/reports.dto";

@Injectable()
export class ReportsRepository {
  constructor (
    private readonly firestoreService: FirestoreService
  ) {}

  async findAll(params: GetReportDto): Promise<{ data: Report[], results: number }> {
    let query: any = this.firestoreService.reports;

    Object.keys(params).forEach(key => {
      if (params[key]) {
        query = query.where(key, '==', params[key])
      }
    })

    const reports = await query.get();
    if (reports.empty) return { data: [], results: 0 }

    const response: Report[] = reports.map((doc: FirebaseFirestore.DocumentData) => modelReport(doc))

    return { data: response, results: response.length };
  }

  async findById(id: string): Promise<Report | null> {
    const report = await this.firestoreService.reports
      .doc(id)
      .get()

    if (!report.exists) return null;

    return modelReport(report);
  }

  async create(params: Report): Promise<Report> {
    const docRef = this.firestoreService.reports.doc();
    await docRef.create(params);

    return {
      id: docRef.id,
      ...params
    }
  }

  async update(id: string, params: UpdateReport): Promise<void> {
    await this.firestoreService.reports
      .doc(id)
      .set(params, { merge: true })
  }

  async delete(id: string): Promise<void> {
    await this.firestoreService.reports
      .doc(id)
      .delete()
  }
}
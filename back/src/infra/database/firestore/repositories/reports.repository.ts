import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../firestore.service";
import { Report, UpdateReport } from "../types/reports.type";
import { modelReport } from "../mappers/reports.mapper";
import { GetReportDto } from "src/infra/http/reports/dto/reports.dto";
import { Timestamp } from "firebase-admin/firestore";
import { ResponseFirebase } from "../types/users.type";

@Injectable()
export class ReportsRepository {
  constructor (
    private readonly firestoreService: FirestoreService
  ) {}

  async findAll(user_id: string, { limit, nextCreatedAt, nextId, ...params }: GetReportDto): Promise<ResponseFirebase<Report[]>> {
    let query: any = this.firestoreService.reports.where("user_id", "==", user_id);

    Object.keys(params).forEach(key => {
      if (params[key]) {
        query = query.where(key, '==', params[key])
      }
    })

    query = query.orderBy("created_at", "desc").orderBy("__name__", "desc").limit(limit || 10);

    if (nextCreatedAt && nextId) {
      query = query.startAfter(Timestamp.fromDate(new Date(nextCreatedAt)), nextId);
    }

    const reports = await query.get();
    if (reports.empty) return { data: [], results: 0, nextCursor: null }

    const categoryIds = reports.docs.map(doc => doc.data()?.category_id);
    const categories = await this.firestoreService.categories.where("__name__", "in", categoryIds).get();
    const categoryMap = new Map(categories.docs.map(doc => {
      const data = doc.data();

      return [doc.id, {
        id: doc.id,
        name: data.name,
        icon_name: data.icon_name,
        icon_color: data.icon_color,
      }]
    }));

    const response: Report[] = reports?.docs?.map((doc: FirebaseFirestore.DocumentData) => {
      return { ...modelReport(doc), category: categoryMap.get(doc.data()?.category_id) || null }
    })

    const lastDoc = reports.docs[reports.docs.length - 1];

    return {
      data: response,
      results: response.length,
      nextCursor: {
        created_at: lastDoc?.data()?.created_at?.toDate() || null,
        id: lastDoc.id,
      }
    };
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
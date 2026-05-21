import { sql } from "../../db";

class IssuesService {
  async createIssue(data: {
    title: string;
    description: string;
    type: string;
    reporter_id: number;
  }) {
    const { title, description, type, reporter_id } = data;

    const res = await sql`
      INSERT INTO issues (title, description, type, status, reporter_id)
      VALUES (${title}, ${description}, ${type}, 'open', ${reporter_id})
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at;
    `;
    return res[0];
  }
}

export default new IssuesService();

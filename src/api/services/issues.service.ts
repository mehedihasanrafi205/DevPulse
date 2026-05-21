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

  async getAllIssues(filters: {
    sort?: string;
    type?: string;
    status?: string;
  }) {
    const { sort = "newest", type, status } = filters;

    let query = sql`
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues WHERE 1=1
    `;

    if (type) {
      query = sql`${query} AND status = ${status}`;
    }
    if (status) {
      query = sql`${query} AND status = ${status}`;
    }

    if (sort === "oldest") {
      query = sql`${query} ORDER BY created_at ASC`;
    } else {
      query = sql`${query} ORDER BY created_at DESC`;
    }

    const issues = await query;
    if (issues.length === 0) return [];

    const reporterIds = Array.from(
      new Set(issues.map((iss: any) => iss.reporter_id)),
    );

    const users = await sql`
      SELECT id, name, role FROM users WHERE id IN (${reporterIds});
    `;

    const userMap = new Map(users.map((u: any) => [u.id, u]));

    return issues.map((iss: any) => {
      const reporter = userMap.get(iss.reporter_id);
      return {
        id: iss.id,
        title: iss.title,
        description: iss.description,
        type: iss.type,
        status: iss.status,
        reporter: reporter
          ? {
              id: reporter.id,
              name: reporter.name,
              role: reporter.role,
            }
          : null,
        created_at: iss.created_at,
        updated_at: iss.updated_at,
      };
    });
  }
}

export default new IssuesService();

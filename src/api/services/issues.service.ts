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
      query = sql`${query} AND type = ${type}`;
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
      SELECT id, name, role FROM users WHERE id = ANY(${reporterIds}::int[]);
    `;

    const userMap = new Map(users.map((u: any) => [u.id, u]));

    return issues.map((iss: any) => {
      const { reporter_id, ...issueData } = iss;
      const reporter = userMap.get(reporter_id);

      return {
        ...issueData,
        reporter: reporter
          ? {
              id: reporter.id,
              name: reporter.name,
              role: reporter.role,
            }
          : null,
      };
    });
  }

  async getIssueById(id: number) {
    const res = await sql`
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at 
    FROM issues 
    WHERE id = ${id};
  `;

    if (res.length === 0) {
      return null;
    }

    const issue = res[0] as any;

    const userRes = await sql`
    SELECT id, name, role 
    FROM users 
    WHERE id = ${issue.reporter_id};
  `;

    const reporter = userRes[0] || null;

    const { reporter_id, ...issueData } = issue;

    return {
      ...issueData,
      reporter: reporter
        ? {
            id: reporter.id,
            name: reporter.name,
            role: reporter.role,
          }
        : null,
    };
  }

  async deleteIssue(id: number): Promise<boolean> {
    const check = await sql`
    SELECT id FROM issues WHERE id = ${id};
  `;

    if (check.length === 0) {
      return false;
    }

    await sql`
    DELETE FROM issues WHERE id = ${id};
  `;

    return true;
  }
}

export default new IssuesService();

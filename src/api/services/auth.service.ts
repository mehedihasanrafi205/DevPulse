import { sql } from "../../db";
import type { RUser } from "../../types";
import bcrypt from "bcrypt";

class AuthService {
  async createUser(user: RUser & { password: string }) {
    const { id, name, email, role, password } = user;

    const hash = await bcrypt.hash(password, 10);

    const res = await sql`
        INSERT INTO users (name,email,password,role)
        VALUES (${name},${email}, ${hash},COALESCE(${role},'contributor'))
        RETURNING id, name, email, role, created_at,  updated_at
    `;
    return res[0];
  }
}

export default new AuthService();

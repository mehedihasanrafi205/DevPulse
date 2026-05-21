import { sql } from "../../db";
import type { RUser, User } from "../../types";
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
  async validateUser(email: string, plainPassword: string) {
    const res = await sql`
    SELECT * FROM users WHERE email = ${email}
    `;

    if (!res.length) {
      return null;
    }

    const { password, ...user } = res[0] as User;
    const isValid = await bcrypt.compare(plainPassword, password);

    return isValid ? user : null;
  }
}

export default new AuthService();

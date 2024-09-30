import { Pool } from "pg";

export interface DbConnection {
  query(sql: string, params?: any[]): Promise<any[]>;
  close(): Promise<void>;
}

export class PgConnection implements DbConnection {
  private pool: Pool;

  public constructor(connectionString: string) {
    const url = new URL(connectionString);
    this.pool = new Pool({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1),
      port: parseInt(url.port),
    });
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      const queryResult = await client.query(sql, params);
      return queryResult.rows;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

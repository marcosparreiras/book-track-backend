import { Pool, type PoolClient } from "pg";
import { Logger } from "../domain/bondaries/logger";

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
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    let client: PoolClient | null = null;
    try {
      client = await this.pool.connect();
      const queryResult = await client.query(sql, params);
      return queryResult.rows;
    } catch (error: unknown) {
      Logger.getInstance().fatal(JSON.stringify(error));
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

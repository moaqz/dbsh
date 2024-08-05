import pg from "pg";
import type { DatabaseAdapter } from "../types";

export class PostgresAdapter implements DatabaseAdapter {
  private _client: pg.Client;

  constructor(dsn: string) {
    this._client = new pg.Client(dsn);
  }

  public connect() {
    return this._client.connect();
  }

  public close() {
    return this._client.end();
  }

  public async getTables() {
    const tables = await this._client.query(`
      SELECT tablename  
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'`,
    );

    return tables.rows.map(row => row.tablename);
  };

  public async getTableInfo(table: string) {
    const results = await this._client.query(
      `SELECT 
        column_name, 
        data_type,
        is_nullable,
        column_default
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE table_name = $1 AND table_schema = 'public'`,
      [table],
    );

    if (results.rowCount === 0) {
      return null;
    }

    const cols = results.rows.map(row => ({
      name: row.column_name,
      default: row.column_default,
      nullable: row.is_nullable === "YES",
      type: row.data_type,
    }));

    return { name: table, cols };
  };

  public async getSchema() {
    throw new Error("Feature not implemented yet");
    return [];
  };
}

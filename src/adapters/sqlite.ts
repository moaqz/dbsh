import Database from "better-sqlite3";
import type { DatabaseAdapter } from "../types";

interface TableColumn {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: unknown;
  pk: number;
}

export class SQLiteAdapter implements DatabaseAdapter {
  private _db: Database.Database;

  constructor(dsn: string) {
    this._db = new Database(dsn);
  }

  public getTables() {
    const rows = this._db
      .prepare("SELECT name FROM sqlite_schema WHERE type = 'table'")
      .all();

    const tables = rows.map(row => (row as any).name);
    return Promise.resolve(tables);
  }

  public getTableInfo(table: string) {
    const rows = this._db.pragma(`table_info(${table})`) as TableColumn[];

    if (!rows.length) {
      return Promise.resolve(null);
    }

    const cols = rows.map(row => ({
      name: row.name,
      default: row.dflt_value,
      nullable: !row.notnull,
      type: row.type,
    }));

    return Promise.resolve({ name: table, cols });
  }

  public getSchema() {
    const rows = this._db
      .prepare("SELECT sql FROM sqlite_schema WHERE sql IS NOT NULL ORDER BY tbl_name")
      .all();

    const schema = rows.map(row => `${(row as any).sql};`);
    return Promise.resolve(schema);
  }
}

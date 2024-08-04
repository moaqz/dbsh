import Database from "better-sqlite3";
import type { DatabaseAdapter, TableInfo } from "../types";

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

    return rows.map(row => (row as any).name);
  }

  public getTableInfo(table: string): TableInfo | null {
    const rows = this._db.pragma(`table_info(${table})`) as TableColumn[];

    if (!rows.length) {
      return null;
    }

    const cols = rows.map(row => ({
      name: row.name,
      default: row.dflt_value,
      nullable: !row.notnull,
      type: row.type,
    }));

    return { name: table, cols };
  }

  public getSchema(): string[] {
    const rows = this._db
      .prepare("SELECT sql FROM sqlite_schema WHERE sql IS NOT NULL ORDER BY tbl_name")
      .all();

    return rows.map(row => `${(row as any).sql};`);
  }
}

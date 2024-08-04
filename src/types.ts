export interface DatabaseAdapter {
  readonly getTables: () => Promise<string[]>;
  readonly getTableInfo: (table: string) => Promise<TableInfo | null>;
  readonly getSchema: () => Promise<string[]>;
}

export interface TableInfo {
  name: string;
  cols: {
    name: string;
    type: string;
    nullable: boolean;
    default: unknown;
  }[];
}

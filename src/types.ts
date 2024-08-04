export interface DatabaseAdapter {
  readonly getTables: () => string[];
  readonly getTableInfo: (table: string) => TableInfo | null;
  readonly getSchema: () => string[];
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

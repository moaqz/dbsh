import process from "node:process";
import fs from "node:fs";
import path from "node:path";

import { defineCommand, runMain } from "citty";
import { consola } from "consola";

import { SQLiteAdapter } from "./adapters/sqlite";
import type { DatabaseAdapter } from "./types";
import { padTitleWithDots, padWithDots } from "./printer";
import { PostgresAdapter } from "./adapters/postgres";

let _adapter: DatabaseAdapter;

const main = defineCommand({
  meta: {
    name: "dbsh",
    version: "0.1.0",
    description: "Tiny database client for the terminal",
  },
  args: {
    driver: {
      type: "string",
      required: true,
      default: "sqlite",
      description: "The database driver (e.g. 'sqlite', 'postgres')",
    },
    dsn: {
      type: "string",
      required: false,
      description: "The database connection string",
    },
  },
  async setup({ args }) {
    let _dsn = args.dsn;

    if (!_dsn) {
      const ok = await consola.prompt(
        "No database connection was provided. Would you like to load it from the .env file?",
        {
          required: true,
          type: "confirm",
        },
      );

      if (!ok) {
        process.exit(0);
      }

      const dotenv = await import("dotenv");
      dotenv.config();

      _dsn = process.env.DATABASE_URL || process.env.DB_URL || process.env.DBSH_URL || "";

      if (!_dsn) {
        consola.error(
          "No database connection found in the .env file. Please ensure `DATABASE_URL`, `DB_URL`, or `DBSH_URL` is set.",
        );
        process.exit(1);
      }
    }

    switch (args.driver) {
      case "sqlite":
        _adapter = new SQLiteAdapter(_dsn);
        break;
      case "postgres":
        _adapter = new PostgresAdapter(_dsn);
        break;
      default:
        throw new Error("Driver not implemented yet.");
    }

    await _adapter.connect();
  },
  async cleanup() {
    await _adapter.close();
  },
  subCommands: {
    table: {
      meta: {
        description: "Display information about the given database table",
      },
      args: {
        table: {
          type: "string",
          required: false,
          description: "The name of the table",
        },
      },
      async run({ args }) {
        let tableName: string | undefined = args.table;
        if (!tableName) {
          const tables = await _adapter.getTables();

          if (!tables.length) {
            process.exit(0);
          }

          tableName = await consola.prompt("Which table would you like to inspect?", {
            required: true,
            type: "select",
            options: [...tables],
          });
        }

        const tableInfo = await _adapter.getTableInfo(tableName);
        if (!tableInfo) {
          consola.warn(`Table ${tableName} doesn't exist.`);
          process.exit(0);
        }

        console.log(`\n\n${padTitleWithDots(tableInfo.name)}`);
        for (const col of tableInfo.cols) {
          const typeText = `${col.type.toLowerCase()}${col.nullable ? ", nullable" : ""}`;
          console.log(padWithDots(col.name, typeText));
        }
      },
    },
    schema: {
      meta: {
        description: "Show table schemas",
      },
      args: {
        output: {
          type: "string",
          required: false,
          description: "The output file",
        },
      },
      async run({ args }) {
        const schema = (await _adapter.getSchema()).join("\n\n");
        const { output } = args;

        if (typeof output === "string") {
          const stat = fs.statSync(output, { throwIfNoEntry: false });
          const destFile = path.extname(output) === ".sql"
            ? output
            : `${output}.sql`;

          if (!stat) {
            const dir = path.dirname(destFile);

            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
          }

          fs.writeFileSync(destFile, schema);
          consola.success(`Schema has been written to ${destFile}`);
          process.exit(0);
        }

        console.log(schema);
      },
    },
    tables: {
      meta: {
        description: "List all existing tables in the database",
      },
      async run() {
        const tables = await _adapter.getTables();

        if (!tables.length) {
          consola.warn(`Database does not contain any table.`);
          process.exit(0);
        }

        console.log(padTitleWithDots("Tables"));
        for (const table of tables) {
          console.log(padWithDots(table, ""));
        }
      },
    },
  },
});

runMain(main);

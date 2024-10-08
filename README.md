![dbsh](https://github.com/user-attachments/assets/a24fe451-546a-4e33-be56-2e2a8a511893)

## 🪐 Features

✅ Display detailed information about a specific table.

✅ Show schema definitions for all tables in the database.

✅ List all tables present in the database.

✅ Automatically load database connection URL from `.env` file.

more coming soon...

## ✨ Motivation

I'm not a big fan of tools like `pgAdmin` or `MySQL Workbench`. They are great tools, but they just provide more information than I need. I prefer using the CLIs that each database provides, but installing `sqlite3`, `psql`, and learning all the commands is a bit too much work for me 😅.

I wanted something simpler and easy to extend, so I decided to create my own tool to get information from my database without leaving my terminal.

The project is inspired by `artisan` (from Laravel) and `wrangler` (from Cloudflare).

## 🛠️ Usage

For one time use of the command, run the following command:

```bash
npx dbsh
```

To install the command globally, run the following command:

```bash
npm install -g dbsh
dbsh
```

## 🔭 Roadmap

Here's what you can expect in future releases:

- Support for more databases.
- An option to read the database connection URL from a configuration file, like `.env`. **(released in v0.2.0)**
- Include additional information such as indexes and foreign key definitions in the `table` command.

## 📃 License

Published under the [MIT](https://github.com/moaqz/dbsh/blob/main/LICENSE) license

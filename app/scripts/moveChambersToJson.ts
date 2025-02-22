/*
  This script was used to get more chambers info from different sources,
  but it was used when the chambers where a table in the db.
  There is no longer a chambers table in the db as it has been moved to a json file.
*/

// import dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });

// import { chambersRepository } from "@/app/services/chambers/repository";
// import { writeFile } from "fs/promises";
// import prettier from "prettier";

// const filename = "app/[company]/chambers.ts";

// async function main() {
//   const chambers = await chambersRepository.getAll();

//   const json = Object.fromEntries(
//     chambers.map((chamber) => {
//       const { id, ...data } = chamber;
//       void id;
//       return [data.code, data];
//     }),
//   );

//   const fileContent = `export const chambers = ${JSON.stringify(json)}`;
//   const formattedFileContent = await prettier.format(fileContent, {
//     parser: "typescript",
//   });

//   await writeFile(filename, formattedFileContent);
// }

// main();

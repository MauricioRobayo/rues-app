import fs from "node:fs/promises";
import path from "node:path";
import pRetry from "p-retry";
import prettier from "prettier";

interface CiiuData {
  description: string;
  code: string;
  children?: CiiuData[];
}

async function main() {
  const filePath = path.join(__dirname, "ciiuData.json");

  let data: CiiuData[] | null;
  try {
    data = JSON.parse(await fs.readFile(filePath, "utf-8"));
  } catch {
    console.log("Could not find file.");
    data = await fetchCiiuData();
    await fs.writeFile(filePath, JSON.stringify(data));
  }

  if (!data) {
    console.log("No CIIU data");
    return;
  }
  const ciiuCodeDict = generateCiiuDict(data);
  const fileContent = `export const ciiuDict: Record<string, string> = ${JSON.stringify(ciiuCodeDict)}`;
  const formattedFileContent = await prettier.format(fileContent, {
    parser: "typescript",
  });
  await fs.writeFile(path.join(__dirname, "ciiuDict.ts"), formattedFileContent);
  console.log("Done!");
}

function generateCiiuDict(
  data: CiiuData[],
  result: Record<string, string> = {},
) {
  for (const section of data) {
    if (section.children) {
      generateCiiuDict(section.children, result);
    } else {
      result[section.code] = section.description;
    }
  }
  return result;
}

async function fetchCiiuData({
  fieldParam = "",
  level = 1,
  ciiuData = null,
}: {
  fieldParam?: string;
  level?: number;
  ciiuData?: CiiuData[] | null;
} = {}) {
  if (level > 4) {
    return ciiuData;
  }

  const data = await fetchData({
    fieldParam,
    level: String(level),
  });
  const levelToFieldParamMap: Record<number, string> = {
    2: "seccion_cod",
    3: "division_cod",
    4: "grupo_cod",
    5: "clase_cod",
  };

  for (const { fields } of data) {
    const nextLevel = level + 1;

    const fieldCode = fields[levelToFieldParamMap[nextLevel]];

    console.log(
      "level:",
      String(level),
      "fieldParam:",
      String(fieldParam).padStart(4, " "),
      "fieldCode:",
      String(fieldCode).padStart(4, " "),
    );

    ciiuData ??= [];
    const partialData: CiiuData = {
      description: fields.descripcion.trim(),
      code: fieldCode,
    };
    if (nextLevel <= 4) {
      partialData.children = [];
    }
    ciiuData.push(partialData);

    await fetchCiiuData({
      fieldParam: fieldCode,
      level: nextLevel,
      ciiuData: partialData.children,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000 * level));
  }
  return ciiuData;
}

async function fetchData({
  fieldParam = "",
  level,
}: {
  fieldParam?: string;
  level: string;
}) {
  const query = new URLSearchParams({
    fieldParam,
    level: String(level),
  });

  const url = `https://clasificaciones.dane.gov.co/ciiu4-0/jerarquias/?${query}`;

  try {
    const response = await pRetry(() => fetch(url), {
      onFailedAttempt: (error) => {
        console.log(
          `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
        );
      },
      retries: 5,
    });
    return response.json();
  } catch (err) {
    console.error(`Fetch failed on URL: ${url}`);
    throw err;
  }
}

main();

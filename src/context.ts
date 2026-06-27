import fs from "node:fs";
import path from "node:path";

export function collectFileContext(files: string[]): string {
  const sections: string[] = [];
  for (const file of files) {
    const abs = path.resolve(file);
    if (!fs.existsSync(abs)) continue;
    const content = fs.readFileSync(abs, "utf-8");
    sections.push(`--- FILE: ${file} ---\n${content}`);
  }
  return sections.join("\n\n");
}

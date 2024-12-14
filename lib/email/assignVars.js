import { readFile } from "node:fs/promises";
import { join } from "path";

/*
  Vars:{
    passwordResetCode: {code}
    emailConfirmationLink: {link}
    welcominhNewUser: {userName}
  }

*/

const templateDirName = join(process.cwd(), "lib/email/", "emailTemplates");
async function templateImporter(templateFileName) {
  let fileName = `${templateFileName}`;
  if (!fileName.endsWith(".email")) {
    fileName = templateFileName + ".email";
  }
  const fileBuffer = await readFile(
    join(templateDirName, fileName),
    "utf-8",
    "r"
  );
  return fileBuffer.toString("utf-8");
}

export default async function assignVarsInHtmlEmail(fileName, varObjs) {
  let templateStr = await templateImporter(fileName);

  for (const [key, val] of Object.entries(varObjs)) {
    templateStr = templateStr.replaceAll(`<[{${key}}]>`, val);
  }
  return templateStr;
}

import * as FileSystem from "fs";

export class JsonSchemaReader {
  public loadSchema(schemaPath: string) {
    FileSystem.readFile(schemaPath, (err: Error, data: Buffer) => {
      console.log("Error:", err);
      console.log("Data:", data);

    })
  }
}

import * as FileSystem from "fs";

export class JsonSchemaReader {

   private _schema: Object;

   public getSchema(): any {
     return this._schema;
   }

   public getProperties(): any {
      return this._schema["properties"];
   }

  public loadSchema(schemaPath: string, callback: () => any) {
    FileSystem.readFile(schemaPath, (err: Error, data: Buffer) => {
      if (err) {
         console.error("Error:", err);
         process.exit(1);
      }

      this._schema = JSON.parse(data.toString());

      callback();
    })
  }
}

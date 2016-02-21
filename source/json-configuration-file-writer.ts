import * as FileSystem from "fs";

export class JsonConfigurationFileWriter {

  private _paths: { [id: string]: string } = {};

  public set(path: string, value: any) {
    this._paths[path] = value;
  }

  public writeFile(path: string) {
    FileSystem.writeFile(path, "test", (error: Error) => {
      console.log("done writing");
    });
  }
}

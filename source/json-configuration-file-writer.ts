import * as FileSystem from "fs";

export class JsonConfigurationFileWriter {

  private _config: Object = {};

  public set(path: string, value: any) {

    this._config[path] = value;
  }

  public writeFile(path: string) {
    FileSystem.writeFile(path, JSON.stringify(this._config), (error: Error) => {
      console.log("done writing");
    });
  }
}

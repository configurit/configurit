import * as FileSystem from "fs";

export class JsonConfigurationFileWriter {

  private _config: Object = {};

  public set(path: string, value: any) {
    let map = path.split(".");

    let parent = this._config;

    for (let i = 0; i < map.length - 1; i++) {

      if (this._config === undefined) {

        parent[map[i]] = {};
        parent = parent[map[i]];
      }
    }

    parent[map[map.length - 1]] = value;
  }

  public writeFile(path: string) {
    FileSystem.writeFile(path, JSON.stringify(this._config), (error: Error) => {
      console.log("done writing");
    });
  }
}

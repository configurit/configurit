class Configuration {
}

import * as Promptly from "promptly";

export class ConfigGenerator {

  public constructor() {
    this._schema = {
      "properties": {
        "a": {
          "title": "Test",
          "description": "A thing to be tested"
        },
        "b": {
          "title": "Test B",
          "description": "B thing to be tested"
        },
        "c": 3,
        "child": {
          "type": "object",
          "properties": {
            "1": 1,
            "2": 2,
            "3": 3,
            "grandchild": {
              "type": "object",
              "properties": {
                "1": 1,
                "2": 2,
                "3": 3
              }
            }
          }
        }
      }
    };
  }

  private _schema: Object;

  public loadSchema(schema: any) {
    this._schema = schema;
  }

  public async getUserProperty(propertyName: string, propertyDefinition: any, currentValue: any): Promise<any> {

    return new Promise<string>((resolve, reject) => {

      let prompt = "\r\n";

      if (propertyDefinition.title) {
         prompt += propertyDefinition.title + "\r\n";
      }
      if (propertyDefinition.description) {
         prompt += propertyDefinition.description + "\r\n";
      }
      if (currentValue !== undefined) {
        prompt += "(current value: " + currentValue + ")\r\n";
      }

      prompt += propertyName;

      Promptly.prompt(prompt + " >", (err: Error, value: string) => {

        if (err) {
          reject(err);
        }
        resolve(value);
      });
    })
  }
/*
  private _getUserProperty(propertyPath: string) {
    this.getUserProperty(propertyPath).then()
  }*/

  private _getNextProperty(schemaDefinition: any, currentIndex: number, o: any, resolve: (config: any) => any) {
    let nextPropertyName = Object.keys(schemaDefinition.properties)[currentIndex + 1];

    if (nextPropertyName) {
      if (schemaDefinition.properties[nextPropertyName].type === "object") {
        o[nextPropertyName] = {};
        this._getObject(schemaDefinition.properties[nextPropertyName], o[nextPropertyName], () => { this._getNextProperty(schemaDefinition, currentIndex + 1, o, resolve)})
      }
      else {
        this.getUserProperty(nextPropertyName, schemaDefinition.properties[nextPropertyName], o[nextPropertyName]).then(s => { o[nextPropertyName] = s; this._getNextProperty(schemaDefinition, currentIndex + 1, o, resolve) } )
      }
    }
    else {
      resolve(o);
    }
  }

  private _getObject(schemaDefinition: any, o: any, resolve: (config: any) => any) {
    this._getNextProperty(schemaDefinition, -1, o, resolve);
  }

  public async getUserInput(currentConfig: any, requiredOnly: boolean, ignoreValidation: boolean): Promise<Configuration> {

    return new Promise<Configuration>((resolve, reject) => {
      let config = currentConfig;

      if (!config) {
        config = {};
      }
      //for (let i in this._schema) {
        /*this.getUserProperty("a").then(s => {config["a"] = s;
          this.getUserProperty("b").then(s => {config["b"] = s;
            this.getUserProperty("c").then(s => { config["c"] = s; resolve(config) })
          });
        });*/
      //}

      this._getObject(this._schema, config, resolve);

      //resolve(config);
    });

  }
}

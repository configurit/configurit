class Configuration {
}

import * as Promptly from "promptly";

export class ConfigGenerator {

  public constructor() {
  }

  private _schema: any;

  public loadSchema(schema: any) {
    this._schema = schema;
  }

  public async getUserProperty(propertyName: string, propertyDefinition: any, currentValue: any): Promise<any> {

    return new Promise<any>((resolve, reject) => {

      let prompt = "\r\n\r\n";

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

        if (propertyDefinition.type === "boolean") {
          if (value === "true" || value === "t" || value === "y" || value === "yes") {
            resolve(true);
          }
          else {
            resolve(false);
          }
        }
        else if (propertyDefinition.type === "number") {
          resolve(parseFloat(value));
        }
        else if(propertyDefinition.type === "integer") {
          resolve(parseInt(value));
        }
        else {
          resolve(value);
        }


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
        if (!o[nextPropertyName]) {
          o[nextPropertyName] = {};
        }
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

  private _getArray(schemaDefinition: any, array: any[], currentIndex: number, resolve: (config: any) => any) {
    Promptly.confirm("would you like to add to " + schemaDefinition.title, (error: Error, value: boolean) => {
      if (value) {
        if (schemaDefinition.items.type === "object") {
          if (array[currentIndex] === undefined) {
            array[currentIndex] = {};
          }

          this._getObject(schemaDefinition.items, array[currentIndex], () => this._getArray(schemaDefinition, array, currentIndex + 1, resolve))
        }
        else if (schemaDefinition.items.type === "array") {
          if (array[currentIndex] === undefined) {
            array[currentIndex] = [];
          }
          this._getArray(schemaDefinition.items, array[currentIndex], 0, () => this._getArray(schemaDefinition, array, currentIndex + 1, resolve))
        }
        else {
            this.getUserProperty("", schemaDefinition.items, array[currentIndex])
            .then(s => { array[currentIndex] = s; this._getArray(schemaDefinition, array, currentIndex + 1, resolve) } )
        }
      }
      else {
        resolve(array);
      }
    })
  }

  public async getUserInput(currentConfig: any, requiredOnly: boolean, ignoreValidation: boolean): Promise<Configuration> {

    return new Promise<Configuration>((resolve, reject) => {
      let config = currentConfig;


      //for (let i in this._schema) {
        /*this.getUserProperty("a").then(s => {config["a"] = s;
          this.getUserProperty("b").then(s => {config["b"] = s;
            this.getUserProperty("c").then(s => { config["c"] = s; resolve(config) })
          });
        });*/
      //}
      if (this._schema.type === "array") {
        if (!config) {
          config = [];
        }
        this._getArray(this._schema, config, 0, resolve);

      }
      else {
        if (!config) {
          config = {};
        }
        this._getObject(this._schema, config, resolve);
      }

      //resolve(config);
    });

  }
}

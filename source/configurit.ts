#!/usr/bin/env node

///<reference path="../typings/commander/commander.d.ts"/>
///<reference path="../typings/promptly/promptly.d.ts"/>
import * as Commander from "commander";
import * as Promptly from "promptly";

import { JsonConfigurationFileWriter } from "./json-configuration-file-writer";
import { JsonSchemaReader } from "./json-schema-reader";
import { ConfigGenerator } from "./config-generator";

import * as FileSystem from "fs";

let configWriter = new JsonConfigurationFileWriter();

let configurit = new Commander.Command();

configurit
  .version("")
  .option("-v, --verbose", "Find out what's happening")
  .option("-s, --schemaLocation [location]", "Where is that schema")
  .option("-o, --outputFile [location]", "Where it's gonna be")
  .parse(process.argv);

let generator = new ConfigGenerator();

let getDetails = (currentConfig?: any) => {
  generator.getUserInput(true, true).then((config: any) => {
    console.log(config);
    Promptly.confirm("Lookin good?", (err: Error, value: string) => {
        //configWriter.set("name", value);
        console.log(value);

        if (value) {
          checkOutput(config);
        }
        else {
          getDetails(config);
        }
    });
  });
}

//console.log("ready to do something else whilst waiting");

let schemaReader = new JsonSchemaReader();

let readSchema = (path: string) => {
  schemaReader.loadSchema(path, () => {
  generator.loadSchema(schemaReader.getSchema());
  getDetails() });
}

let checkOutput = (config: any) => {

  if (configurit["outputFile"]) {
    save(config, configurit["outputFile"]);
  }

  Promptly.prompt("Output file: ", { validator: null }, (err: Error, value: string) => {
    save(config, value);

  });
}

let save = (config: any, path: string) => {

    FileSystem.writeFile(path, JSON.stringify(config), (error: Error) => {
      console.log("done writing");
      process.exit(0);
    });
}

if(configurit["schemaLocation"]) {
    readSchema(configurit["schemaLocation"]);
}
else {
  Promptly.prompt("Schema location: ", { validator: null }, (err: Error, value: string) => {
      //configWriter.set("name", value);
      readSchema(value);
  });
}
/*
let i = 0;

let counts = {
  "": 0
}

let getDetails = (objectName?: string) => {
     if (counts[objectName] === undefined) {
       counts[objectName] = 0;
     }

   let properties = schemaReader.getProperties();
   if (objectName) {
     let map = objectName.split(".");

     for (let item of map) {
       properties = properties[item].properties;
     }
   }

   if (counts[objectName] < Object.keys(properties).length) {

      let propertyName = Object.keys(properties)[counts[objectName]];

      if (properties[propertyName].type === "object") {
        let x = propertyName;
        if (objectName) {
          x = objectName + "." + propertyName;
        }
        getDetails(x);
      }
      else {

        let prompt = "\r\n";

        if (properties[propertyName].title) {
           prompt = properties[propertyName].title + "\r\n";
        }
        if (properties[propertyName].description) {
           prompt = properties[propertyName].description + "\r\n";
        }

        prompt += propertyName;

        Promptly.prompt(prompt + " >", (err: Error, value: string) => {
          if (objectName) {
            propertyName = objectName + "." + propertyName;
          }
           configWriter.set(propertyName, value);
           counts[objectName]++;
           getDetails();
        });
    }
   }
   else {
      getOutput();
   }

}

let getOutput = () => {

  if (configurit["outputFile"]) {
    writeOutput(configurit["outputFile"]);
  }

  Promptly.prompt("Output file: ", { validator: null }, (err: Error, value: string) => {
    configWriter.writeFile(value);

  });
}

let writeOutput = (path: string) => {
  configWriter.writeFile(path);

  process.exit(1);
}

if (configurit["verbose"]) {
  console.log("I are writing");
}

if(configurit["schemaLocation"]) {
    console.log('Name is:', configurit["schemaLocation"]);
    readSchema(configurit["schemaLocation"]);
}
else {
  Promptly.prompt("Schema location: ", { validator: null }, (err: Error, value: string) => {
      configWriter.set("name", value);
      readSchema(value);
  });
}
*/

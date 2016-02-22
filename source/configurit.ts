///<reference path="../typings/commander/commander.d.ts"/>
///<reference path="../typings/promptly/promptly.d.ts"/>
import * as Commander from "commander";
import * as Promptly from "promptly";

import { JsonConfigurationFileWriter } from "./json-configuration-file-writer";
import { JsonSchemaReader } from "./json-schema-reader";

let configWriter = new JsonConfigurationFileWriter();

let configurit = new Commander.Command();

configurit
  .version("")
  .option("-v, --verbose", "Find out what's happening")
  .option("-s, --schemaLocation [location]", "Where is that schema")
  .option("-o, --outputFile [location]", "Where it's gonna be")
  .parse(process.argv);


let schemaReader = new JsonSchemaReader();

let readSchema = (path: string) => {
  schemaReader.loadSchema(path, getDetails);
}
let i = 0;

let getDetails = () => {
   let properties = schemaReader.getProperties();
   if (i < Object.keys(properties).length) {

      let propertyName = Object.keys(properties)[i];

      let prompt = "";

      if (properties[propertyName].title) {
         prompt = properties[propertyName].title + "\r\n";
      }
      if (properties[propertyName].description) {
         prompt = properties[propertyName].description + "\r\n";
      }

      prompt += propertyName;

      Promptly.prompt(prompt + ">", (err: Error, value: string) => {
         configWriter.set(propertyName, value);
         i++;
         getDetails();
      });
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

import {
  FILE_FORMAT_CUSTOM_1,
  FILE_FORMAT_CUSTOM_2,
  FILE_FORMAT_DCI,
  FILE_FORMAT_NEW,
  FILE_FORMAT_SEMA,
  FILE_FORMAT_UNKNOWN,
} from "./converter/constants.js";
import crypto from "crypto";

export const csvHeader = [
  "AAIA_BrandID",
  "Part",
  "Year",
  "Make",
  "Model",
  "Submodel",
  "PartType",
  "Position",
  "Quantity",
  "Region",
  "Qualifiers",
  "FitmentNotes",
  "MfrLabel",
  "VehicleTypeGroupName",
  "Liter",
  "Cylinders",
  "BlockType",
  "FuelDeliveryTypeName",
  "FuelTypeName",
  "EngineDestinationName",
  "EngineVINName",
  "ValvesPerEngine",
  "CC",
  "CID",
  "EngineBoreInches",
  "EngineBoreMetric",
  "EngineStrokeInches",
  "EngineStrokeMetric",
  "FuelDeliverySubtypeName",
  "FuelSystemControlTypeName",
  "FuelSystemDesignName",
  "AspirationName",
  "CylinderHeadTypeName",
  "IgnitionSystemTypeName",
  "EngineManufactuerName",
  "EngineVersion",
  "HorsePower",
  "KilowattPower",
  "BodyTypeName",
  "BodyNumberOfDoors",
  "ManufacturerBodyCodeName",
  "BedTypeName",
  "BedLengthInches",
  "BedLengthMetric",
  "BrakeSystemName",
  "BrakeFrontTypeName",
  "BrakeRearTypeName",
  "BrakeABSName",
  "DriveTypeName",
  "FrontSpringTypeName",
  "RearSpringTypeName",
  "SteeringTypeName",
  "SteeringSystemName",
  "TransmissionTypeName",
  "TranmissionNumSpeeds",
  "TransmissionControlTypeName",
  "TransmissionElectronicControlled",
  "TransmissionManufacturerName",
  "WheelbaseInches",
  "WheelbaseMetric",
];

const dciMap = {
  brandaaiaid: "AAIA_BrandID",
  year: "Year",
  makename: "Make",
  modelname: "Model",
  submodelname: "Submodel",
  engbase: "FitmentNotes",
  fueltype: "FuelTypeName",
  fueldelconfig: "FuelDeliveryTypeName",
  asp: "AspirationName",
  engvin: "EngineVINName",
  engdesg: "EngineDestinationName",
  transcontrol: "TransmissionElectronicControlled",
  transmfrcode: "TransmissionManufacturerName",
  transnumspeed: "TranmissionNumSpeeds",
  cylheadtype: "CylinderHeadTypeName",
  fueldelsubtype: "FuelDeliverySubtypeName",
  engversion: "EngineVersion",
  drivetype: "DriveTypeName",
  wheelbase: "WheelbaseInches",
  steeringsystem: "SteeringTypeName",
  BedLength: "BedLengthInches",
  BedTypeName: "BedTypeName",
  bodynumdoor: "BodyNumberOfDoors",
  bodytype: "BodyTypeName",
  brakeabs: "BrakeABSName",
  brakesystem: "BrakeSystemName",
  frontbraketype: "BrakeFrontTypeName",
  rearbraketype: "BrakeRearTypeName",
  frontspringtype: "FrontSpringTypeName",
  rearspringtype: "RearSpringTypeName",
  IgnitionSystemType: "IgnitionSystemTypeName",
  qtyper: "Quantity",
  partterminologyid: "PartType",
  position: "Position",
  exppartno: "Part",
  mfrlabel: "MfrLabel",
};

const newFormatMap = {
  recId: "",
  application_id: "",
  brand_name: "",
  part_name: "",
  pcdb_part_name: "",
  sku: "Part",
  sku_status: "",
  team: "",
  sku_merchant: "",
  year: "Year",
  make_name: "Make",
  model_name: "Model",
  submodel_name: "Submodel",
  enginedesignationname: "",
  enginevinname: "",
  liter: "Liter",
  cc: "CC",
  cid: "CID",
  cylinders: "Cylinders",
  blocktype: "BlockType",
  engborein: "",
  engboremetric: "",
  engstrokein: "",
  engstrokemetric: "",
  fueldeliverytypename: "",
  fueldeliverysubtypename: "",
  fuelsystemcontroltypename: "",
  fuelsystemdesignname: "",
  aspirationname: "AspirationName",
  cylinderheadtypename: "CylinderHeadTypeName",
  fueltypename: "FuelTypeName",
  ignitionsystemtypename: "",
  enginemfrname: "",
  engineversion: "",
  valvesperengine: "",
  bedlength: "",
  bedlengthmetric: "",
  bedtypename: "",
  bodynumdoors: "BodyNumberOfDoors",
  bodytypename: "BodyTypeName",
  brakesystemname: "",
  brakeabsname: "",
  braketypename_front: "",
  braketypename_rear: "",
  drivetypename: "DriveTypeName",
  mfrbodycodename: "",
  springtypename_front: "",
  springtypename_rear: "",
  steeringtypename: "",
  steeringsystemname: "",
  transmissiontypename: "",
  transmissionnumspeeds: "",
  transmissioncontroltypename: "",
  transmissionmfrcode: "",
  transmissionmfrname: "",
  transmissioneleccontrolled: "",
  wheelbase: "",
  wheelbasemetric: "",
  vehicletypename: "",
  oem: "",
  position: "",
  fnotes_name: "FitmentNotes",
  emissions: "",
};

const requiredHeaders = [
  "Year",
  "Make",
  "Model",
  "Submodel",
  "BodyTypeName",
  "BodyNumberOfDoors",
  "Liter",
  "CC",
  "CID",
  "BlockType",
  "Cylinders",
  "FuelTypeName",
  "CylinderHeadTypeName",
  "AspirationName",
  "DriveTypeName",
  "FitmentNotes",
];

export function DetectFileFormat(headers) {
  if (
    headers[0] === "brand_code" &&
    headers[1] === "mpn" &&
    headers[2] === "from" &&
    headers[3] === "to" &&
    headers[4] === "make" &&
    headers[5] === "model" &&
    headers[6] === "submodel"
  ) {
    return FILE_FORMAT_CUSTOM_1;
  } else if (
    headers[0] === "brand_code" &&
    headers[1] === "mpn" &&
    headers[2] === "year" &&
    headers[3] === "make" &&
    headers[4] === "model" &&
    headers[5] === "submodel"
  ) {
    return FILE_FORMAT_CUSTOM_2;
  } else if (isSemaFormat(headers)) {
    return FILE_FORMAT_SEMA;
  } else if (isDciFormat(headers)) {
    return FILE_FORMAT_DCI;
  } else if (isNewFormat(headers)) {
    return FILE_FORMAT_NEW;
  } else {
    console.log(headers);
    return FILE_FORMAT_UNKNOWN;
  }
}

export function ConvertLine(line, fileFormat, headers) {
  let ret = [];
  const newLine = Array(csvHeader.length).fill("");

  switch (fileFormat) {
    case FILE_FORMAT_CUSTOM_1:
      for (let i = line[2]; i <= line[3]; i++) {
        newLine[0] = line[0];
        newLine[1] = line[1];
        newLine[2] = i;
        newLine[3] = line[4];
        newLine[4] = line[5];
        newLine[5] = line[6];
        ret = ret.concat(processLine(newLine));
      }
      break;
    case FILE_FORMAT_CUSTOM_2:
      newLine[0] = line[0];
      newLine[1] = line[1];
      newLine[2] = line[2];
      newLine[3] = line[3];
      newLine[4] = line[4];
      newLine[5] = line[5];
      ret = ret.concat(processLine(newLine));
      break;
    case FILE_FORMAT_DCI:
      line.forEach((value, index) => {
        newLine[csvHeader.indexOf(dciMap[headers[index]])] = value;
      });
      ret = ret.concat(processLine(newLine));
      break;
    case FILE_FORMAT_SEMA:
      ret = ret.concat(processLine(line));
      break;
    case FILE_FORMAT_NEW:
      line.forEach((value, index) => {
        const semaFieldName = newFormatMap[headers[index]];

        if (!semaFieldName) {
          return;
        }

        const semaFieldIndex = csvHeader.indexOf(semaFieldName);

        if (semaFieldIndex === -1) {
          throw new Error(`Unknown field name: ${semaFieldName}`);
        }

        newLine[semaFieldIndex] = value;
      });

      newLine[semaFieldIndex("AAIA_BrandID")] = "XXYYZZ";

      ret = ret.concat(processLine(newLine));
  }

  return ret;
}

function processLine(line) {
  return fixLine(line).map(checkLine);
}

function fixLine(line) {
  const multiYear = line[2].match(/(?<from>\d{4})-(?<to>\d{4})/);

  if (multiYear) {
    const retLines = [];

    for (
      let current = multiYear.groups.from;
      current <= multiYear.groups.to;
      current++
    ) {
      const item = [...line];
      item[2] = current;
      retLines.push(item);
    }

    return retLines;
  }

  if (Number(line[2]) && line[2] < 100) {
    const year = parseInt(line[2], 10);

    if (
      year >
      parseInt(String(new Date().getFullYear()).substring(2), 10) + 1
    ) {
      line[2] = 1900 + year;
    } else {
      line[2] = 2000 + year;
    }
  }

  return [line];
}

function checkLine(line) {
  if (line[0].length > 10) {
    throw new Error(`Brand ID (${line[0]}) is longer than 10 chars`);
  }

  if (line[1].length > 40) {
    throw new Error(`Part Number (${line[1]}) is longer than 30 chars`);
  }

  if (
    Number.isNaN(Number.parseInt(line[2])) ||
    parseInt(line[2], 10) > new Date().getFullYear() + 2 ||
    parseInt(line[2], 10) < 1900
  ) {
    console.log(line);
    throw new Error(`Invalid date: '${line[2]}'`);
  }

  if (line[3].length > 50) {
    throw new Error(`Make (${line[3]}) is longer than 50 chars`);
  }

  if (line[4].length > 100) {
    throw new Error(`Model (${line[4]}) is longer than 100 chars`);
  }

  if (line[5].length > 100) {
    throw new Error(`Submodel (${line[5]}) is longer than 100 chars`);
  }

  return line;
}

function isSemaFormat(headers) {
  return headers.every((h, i) => h === csvHeader[i]);
}

function isDciFormat(headers) {
  return Object.keys(dciMap).every((dciKey) => headers.includes(dciKey));
}

function isNewFormat(headers) {
  return Object.keys(newFormatMap).every((newKey) => headers.includes(newKey));
}

export function getMemoryUsage() {
  return Object.entries(process.memoryUsage())
    .map(([k, v]) => `${k} = ${(v / 1024 / 1024).toFixed(2)}MB`)
    .join(", ");
}

export function compactLine(semaLine) {
  return semaLine.filter((v, i) => requiredHeaders.includes(csvHeader[i]));
}

export function semaFieldIndex(fieldName) {
  return csvHeader.indexOf(fieldName);
}

export function getBucket(bucketsCount, id) {
  try {
    const md5Hash = crypto.createHash("md5").update(id).digest("hex");
    const crc = md5Hash.split("").reduce((acc, v) => acc + v.charCodeAt(0), 0);
    return crc % bucketsCount;
  } catch (e) {
    console.log(id);
    throw e;
  }
}

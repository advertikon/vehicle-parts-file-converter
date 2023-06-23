import {
    FILE_FORMAT_CUSTOM_1,
    FILE_FORMAT_CUSTOM_2,
    FILE_FORMAT_DCI,
    FILE_FORMAT_SEMA,
    FILE_FORMAT_UNKNOWN
} from './constants.js';

export const csvHeader = [
    'AAIA_BrandID',
    'Part',
    'Year',
    'Make',
    'Model',
    'Submodel',
    'PartType',
    'Position',
    'Quantity',
    'Region',
    'Qualifiers',
    'FitmentNotes',
    'MfrLabel',
    'VehicleTypeGroupName',
    'Liter',
    'Cylinders',
    'BlockType',
    'FuelDeliveryTypeName',
    'FuelTypeName',
    'EngineDestinationName',
    'EngineVINName',
    'ValvesPerEngine',
    'CC',
    'CID',
    'EngineBoreInches',
    'EngineBoreMetric',
    'EngineStrokeInches',
    'EngineStrokeMetric',
    'FuelDeliverySubtypeName',
    'FuelSystemControlTypeName',
    'FuelSystemDesignName',
    'AspirationName',
    'CylinderHeadTypeName',
    'IgnitionSystemTypeName',
    'EngineManufactuerName',
    'EngineVersion',
    'HorsePower',
    'KilowattPower',
    'BodyTypeName',
    'BodyNumberOfDoors',
    'ManufacturerBodyCodeName',
    'BedTypeName',
    'BedLengthInches',
    'BedLengthMetric',
    'BrakeSystemName',
    'BrakeFrontTypeName',
    'BrakeRearTypeName',
    'BrakeABSName',
    'DriveTypeName',
    'FrontSpringTypeName',
    'RearSpringTypeName',
    'SteeringTypeName',
    'SteeringSystemName',
    'TransmissionTypeName',
    'TranmissionNumSpeeds',
    'TransmissionControlTypeName',
    'TransmissionElectronicControlled',
    'TransmissionManufacturerName',
    'WheelbaseInches',
    'WheelbaseMetric',
];

const dciMap = {
    brandaaiaid: 'AAIA_BrandID',
    year: 'Year',
    makename: 'Make',
    modelname: 'Model',
    submodelname: 'Submodel',
    engbase: 'FitmentNotes',
    fueltype: 'FuelTypeName',
    fueldelconfig: 'FuelDeliveryTypeName',
    asp: 'AspirationName',
    engvin: 'EngineVINName',
    engdesg: 'EngineDestinationName',
    transcontrol: 'TransmissionElectronicControlled',
    transmfrcode: 'TransmissionManufacturerName',
    transnumspeed: 'TranmissionNumSpeeds',
    cylheadtype: 'CylinderHeadTypeName',
    fueldelsubtype: 'FuelDeliverySubtypeName',
    engversion: 'EngineVersion',
    drivetype: 'DriveTypeName',
    wheelbase: 'WheelbaseInches',
    steeringsystem: 'SteeringTypeName',
    BedLength: 'BedLengthInches',
    BedTypeName: 'BedTypeName',
    bodynumdoor: 'BodyNumberOfDoors',
    bodytype: 'BodyTypeName',
    brakeabs: 'BrakeABSName',
    brakesystem: 'BrakeSystemName',
    frontbraketype: 'BrakeFrontTypeName',
    rearbraketype: 'BrakeRearTypeName',
    frontspringtype: 'FrontSpringTypeName',
    rearspringtype: 'RearSpringTypeName',
    IgnitionSystemType: 'IgnitionSystemTypeName',
    qtyper: 'Quantity',
    partterminologyid: 'PartType',
    position: 'Position',
    exppartno: 'Part',
    mfrlabel: 'MfrLabel',
};

export function DetectFileFormat(headers) {
    if (
        headers[0] === 'brand_code' &&
        headers[1] === 'mpn' &&
        headers[2] === 'from' &&
        headers[3] === 'to' &&
        headers[4] === 'make' &&
        headers[5] === 'model' &&
        headers[6] === 'submodel'
    ) {
        return FILE_FORMAT_CUSTOM_1;
    } else if (
        headers[0] === 'brand_code' &&
        headers[1] === 'mpn' &&
        headers[2] === 'year' &&
        headers[3] === 'make' &&
        headers[4] === 'model' &&
        headers[5] === 'submodel'
    ) {
        return FILE_FORMAT_CUSTOM_2
    } else if (isSemaFormat(headers)) {
        return FILE_FORMAT_SEMA;
    } else if (isDciFormat(headers)) {
        return FILE_FORMAT_DCI;
    } else {
        console.log(headers)
       return FILE_FORMAT_UNKNOWN;
    }
}

export function ConvertLine(line, fileFormat, headers) {
    let ret = [];
    const newLine = Array(csvHeader.length);

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

        for(let current = multiYear.groups.from; current <= multiYear.groups.to; current++) {
            const item = [...line];
            item[2] = current;
            retLines.push(item);
        }

        return retLines;
    }

    if (line[2] < 100) {
        const year = parseInt(line[2], 10);

        if (year > parseInt(String(new Date().getFullYear()).substring(2), 10) + 1) {
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
    return Object.keys(dciMap).every(dciKey => headers.includes(dciKey));
}

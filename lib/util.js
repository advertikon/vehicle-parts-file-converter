import {FILE_FORMAT_CUSTOM_1, FILE_FORMAT_CUSTOM_2, FILE_FORMAT_UNKNOWN} from './constants.js';

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
    } else {
        console.log(headers)
       return FILE_FORMAT_UNKNOWN;
    }
}

export function ConvertLine(line, fileFormat) {
    const ret = [];

    switch (fileFormat) {
        case FILE_FORMAT_CUSTOM_1:
            for (let i = line[2]; i <= line[3]; i++) {
                const newLine = Array(csvHeader.length);
                newLine[0] = line[0];
                newLine[1] = line[1];
                newLine[2] = i;
                newLine[3] = line[4];
                newLine[4] = line[5];
                newLine[5] = line[6];
                ret.push(newLine);
            }
            break;
    }

    return ret;
}

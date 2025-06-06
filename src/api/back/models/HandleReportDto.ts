/* tslint:disable */
/* eslint-disable */
/**
 * Public REST api for dota2classic
 * All stuff
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface HandleReportDto
 */
export interface HandleReportDto {
    /**
     * 
     * @type {boolean}
     * @memberof HandleReportDto
     */
    valid: boolean;
    /**
     * 
     * @type {number}
     * @memberof HandleReportDto
     */
    overridePunishmentId?: number;
}

export function HandleReportDtoFromJSON(json: any): HandleReportDto {
    return HandleReportDtoFromJSONTyped(json, false);
}

export function HandleReportDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): HandleReportDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'valid': json['valid'],
        'overridePunishmentId': !exists(json, 'overridePunishmentId') ? undefined : json['overridePunishmentId'],
    };
}

export function HandleReportDtoToJSON(value?: HandleReportDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'valid': value.valid,
        'overridePunishmentId': value.overridePunishmentId,
    };
}



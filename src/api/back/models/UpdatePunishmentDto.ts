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
 * @interface UpdatePunishmentDto
 */
export interface UpdatePunishmentDto {
    /**
     * 
     * @type {string}
     * @memberof UpdatePunishmentDto
     */
    title?: string;
    /**
     * 
     * @type {number}
     * @memberof UpdatePunishmentDto
     */
    durationHours?: number;
}

export function UpdatePunishmentDtoFromJSON(json: any): UpdatePunishmentDto {
    return UpdatePunishmentDtoFromJSONTyped(json, false);
}

export function UpdatePunishmentDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdatePunishmentDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'title': !exists(json, 'title') ? undefined : json['title'],
        'durationHours': !exists(json, 'durationHours') ? undefined : json['durationHours'],
    };
}

export function UpdatePunishmentDtoToJSON(value?: UpdatePunishmentDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title': value.title,
        'durationHours': value.durationHours,
    };
}



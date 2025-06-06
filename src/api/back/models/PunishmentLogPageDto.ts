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
import {
    PunishmentLogDto,
    PunishmentLogDtoFromJSON,
    PunishmentLogDtoFromJSONTyped,
    PunishmentLogDtoToJSON,
} from './';

/**
 * 
 * @export
 * @interface PunishmentLogPageDto
 */
export interface PunishmentLogPageDto {
    /**
     * 
     * @type {Array<PunishmentLogDto>}
     * @memberof PunishmentLogPageDto
     */
    data: Array<PunishmentLogDto>;
    /**
     * 
     * @type {number}
     * @memberof PunishmentLogPageDto
     */
    page: number;
    /**
     * 
     * @type {number}
     * @memberof PunishmentLogPageDto
     */
    perPage: number;
    /**
     * 
     * @type {number}
     * @memberof PunishmentLogPageDto
     */
    pages: number;
}

export function PunishmentLogPageDtoFromJSON(json: any): PunishmentLogPageDto {
    return PunishmentLogPageDtoFromJSONTyped(json, false);
}

export function PunishmentLogPageDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PunishmentLogPageDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'data': ((json['data'] as Array<any>).map(PunishmentLogDtoFromJSON)),
        'page': json['page'],
        'perPage': json['perPage'],
        'pages': json['pages'],
    };
}

export function PunishmentLogPageDtoToJSON(value?: PunishmentLogPageDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'data': ((value.data as Array<any>).map(PunishmentLogDtoToJSON)),
        'page': value.page,
        'perPage': value.perPage,
        'pages': value.pages,
    };
}



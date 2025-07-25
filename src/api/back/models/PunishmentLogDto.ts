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
    RuleDto,
    RuleDtoFromJSON,
    RuleDtoFromJSONTyped,
    RuleDtoToJSON,
    RulePunishmentDto,
    RulePunishmentDtoFromJSON,
    RulePunishmentDtoFromJSONTyped,
    RulePunishmentDtoToJSON,
    UserDTO,
    UserDTOFromJSON,
    UserDTOFromJSONTyped,
    UserDTOToJSON,
} from './';

/**
 * 
 * @export
 * @interface PunishmentLogDto
 */
export interface PunishmentLogDto {
    /**
     * 
     * @type {number}
     * @memberof PunishmentLogDto
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof PunishmentLogDto
     */
    createdAt: string;
    /**
     * 
     * @type {UserDTO}
     * @memberof PunishmentLogDto
     */
    reported: UserDTO;
    /**
     * 
     * @type {UserDTO}
     * @memberof PunishmentLogDto
     */
    executor: UserDTO;
    /**
     * 
     * @type {number}
     * @memberof PunishmentLogDto
     */
    duration: number;
    /**
     * 
     * @type {string}
     * @memberof PunishmentLogDto
     */
    reportId?: string;
    /**
     * 
     * @type {RuleDto}
     * @memberof PunishmentLogDto
     */
    rule: RuleDto;
    /**
     * 
     * @type {RulePunishmentDto}
     * @memberof PunishmentLogDto
     */
    punishment: RulePunishmentDto;
}

export function PunishmentLogDtoFromJSON(json: any): PunishmentLogDto {
    return PunishmentLogDtoFromJSONTyped(json, false);
}

export function PunishmentLogDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PunishmentLogDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'createdAt': json['createdAt'],
        'reported': UserDTOFromJSON(json['reported']),
        'executor': UserDTOFromJSON(json['executor']),
        'duration': json['duration'],
        'reportId': !exists(json, 'reportId') ? undefined : json['reportId'],
        'rule': RuleDtoFromJSON(json['rule']),
        'punishment': RulePunishmentDtoFromJSON(json['punishment']),
    };
}

export function PunishmentLogDtoToJSON(value?: PunishmentLogDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'createdAt': value.createdAt,
        'reported': UserDTOToJSON(value.reported),
        'executor': UserDTOToJSON(value.executor),
        'duration': value.duration,
        'reportId': value.reportId,
        'rule': RuleDtoToJSON(value.rule),
        'punishment': RulePunishmentDtoToJSON(value.punishment),
    };
}



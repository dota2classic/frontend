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
 * @interface ChangeTeamInLobbyDto
 */
export interface ChangeTeamInLobbyDto {
    /**
     * 
     * @type {string}
     * @memberof ChangeTeamInLobbyDto
     */
    steamId?: string;
    /**
     * 
     * @type {number}
     * @memberof ChangeTeamInLobbyDto
     */
    team?: number;
    /**
     * 
     * @type {number}
     * @memberof ChangeTeamInLobbyDto
     */
    index?: number;
}

export function ChangeTeamInLobbyDtoFromJSON(json: any): ChangeTeamInLobbyDto {
    return ChangeTeamInLobbyDtoFromJSONTyped(json, false);
}

export function ChangeTeamInLobbyDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChangeTeamInLobbyDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'steamId': !exists(json, 'steamId') ? undefined : json['steamId'],
        'team': !exists(json, 'team') ? undefined : json['team'],
        'index': !exists(json, 'index') ? undefined : json['index'],
    };
}

export function ChangeTeamInLobbyDtoToJSON(value?: ChangeTeamInLobbyDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'steamId': value.steamId,
        'team': value.team,
        'index': value.index,
    };
}


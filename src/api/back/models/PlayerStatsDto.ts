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
 * @interface PlayerStatsDto
 */
export interface PlayerStatsDto {
    /**
     * 
     * @type {number}
     * @memberof PlayerStatsDto
     */
    gamesPlayed: number;
    /**
     * 
     * @type {number}
     * @memberof PlayerStatsDto
     */
    wins: number;
    /**
     * 
     * @type {number}
     * @memberof PlayerStatsDto
     */
    loss: number;
    /**
     * 
     * @type {number}
     * @memberof PlayerStatsDto
     */
    abandons: number;
    /**
     * 
     * @type {number}
     * @memberof PlayerStatsDto
     */
    kills: number;
    /**
     * 
     * @type {number}
     * @memberof PlayerStatsDto
     */
    deaths: number;
    /**
     * 
     * @type {number}
     * @memberof PlayerStatsDto
     */
    assists: number;
    /**
     * 
     * @type {number}
     * @memberof PlayerStatsDto
     */
    playtime: number;
    /**
     * 
     * @type {boolean}
     * @memberof PlayerStatsDto
     */
    recalibrationAttempted: boolean;
    /**
     * 
     * @type {number}
     * @memberof PlayerStatsDto
     */
    mmr?: number;
    /**
     * 
     * @type {number}
     * @memberof PlayerStatsDto
     */
    rank?: number;
}

export function PlayerStatsDtoFromJSON(json: any): PlayerStatsDto {
    return PlayerStatsDtoFromJSONTyped(json, false);
}

export function PlayerStatsDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlayerStatsDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'gamesPlayed': json['games_played'],
        'wins': json['wins'],
        'loss': json['loss'],
        'abandons': json['abandons'],
        'kills': json['kills'],
        'deaths': json['deaths'],
        'assists': json['assists'],
        'playtime': json['playtime'],
        'recalibrationAttempted': json['recalibrationAttempted'],
        'mmr': !exists(json, 'mmr') ? undefined : json['mmr'],
        'rank': !exists(json, 'rank') ? undefined : json['rank'],
    };
}

export function PlayerStatsDtoToJSON(value?: PlayerStatsDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'games_played': value.gamesPlayed,
        'wins': value.wins,
        'loss': value.loss,
        'abandons': value.abandons,
        'kills': value.kills,
        'deaths': value.deaths,
        'assists': value.assists,
        'playtime': value.playtime,
        'recalibrationAttempted': value.recalibrationAttempted,
        'mmr': value.mmr,
        'rank': value.rank,
    };
}



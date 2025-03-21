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
 * @interface HeroSummaryDto
 */
export interface HeroSummaryDto {
    /**
     * 
     * @type {number}
     * @memberof HeroSummaryDto
     */
    games: number;
    /**
     * 
     * @type {number}
     * @memberof HeroSummaryDto
     */
    wins: number;
    /**
     * 
     * @type {number}
     * @memberof HeroSummaryDto
     */
    losses: number;
    /**
     * 
     * @type {number}
     * @memberof HeroSummaryDto
     */
    kills: number;
    /**
     * 
     * @type {number}
     * @memberof HeroSummaryDto
     */
    deaths: number;
    /**
     * 
     * @type {number}
     * @memberof HeroSummaryDto
     */
    assists: number;
    /**
     * 
     * @type {number}
     * @memberof HeroSummaryDto
     */
    gpm: number;
    /**
     * 
     * @type {number}
     * @memberof HeroSummaryDto
     */
    xpm: number;
    /**
     * 
     * @type {number}
     * @memberof HeroSummaryDto
     */
    lastHits: number;
    /**
     * 
     * @type {number}
     * @memberof HeroSummaryDto
     */
    denies: number;
    /**
     * 
     * @type {number}
     * @memberof HeroSummaryDto
     */
    pickrate: number;
    /**
     * 
     * @type {string}
     * @memberof HeroSummaryDto
     */
    hero: string;
}

export function HeroSummaryDtoFromJSON(json: any): HeroSummaryDto {
    return HeroSummaryDtoFromJSONTyped(json, false);
}

export function HeroSummaryDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): HeroSummaryDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'games': json['games'],
        'wins': json['wins'],
        'losses': json['losses'],
        'kills': json['kills'],
        'deaths': json['deaths'],
        'assists': json['assists'],
        'gpm': json['gpm'],
        'xpm': json['xpm'],
        'lastHits': json['last_hits'],
        'denies': json['denies'],
        'pickrate': json['pickrate'],
        'hero': json['hero'],
    };
}

export function HeroSummaryDtoToJSON(value?: HeroSummaryDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'games': value.games,
        'wins': value.wins,
        'losses': value.losses,
        'kills': value.kills,
        'deaths': value.deaths,
        'assists': value.assists,
        'gpm': value.gpm,
        'xpm': value.xpm,
        'last_hits': value.lastHits,
        'denies': value.denies,
        'pickrate': value.pickrate,
        'hero': value.hero,
    };
}



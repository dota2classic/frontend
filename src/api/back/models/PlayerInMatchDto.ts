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

import { exists, mapValues } from "../runtime";
/**
 * 
 * @export
 * @interface PlayerInMatchDto
 */
export interface PlayerInMatchDto {
  /**
   *
   * @type {string}
   * @memberof PlayerInMatchDto
   */
  steamId: string;
  /**
   *
   * @type {string}
   * @memberof PlayerInMatchDto
   */
  name: string;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  team: number;
  /**
   *
   * @type {string}
   * @memberof PlayerInMatchDto
   */
  hero: string;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  level: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  kills: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  deaths: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  assists: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  gpm: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  xpm: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  heroHealing: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  heroDamage: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  towerDamage: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  lastHits: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  denies: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  gold: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  item0: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  item1: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  item2: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  item3: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  item4: number;
  /**
   *
   * @type {number}
   * @memberof PlayerInMatchDto
   */
  item5: number;
  /**
   *
   * @type {boolean}
   * @memberof PlayerInMatchDto
   */
  abandoned: boolean;
}

export function PlayerInMatchDtoFromJSON(json: any): PlayerInMatchDto {
    return PlayerInMatchDtoFromJSONTyped(json, false);
}

export function PlayerInMatchDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlayerInMatchDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
      steamId: json["steam_id"],
      name: json["name"],
      team: json["team"],
      hero: json["hero"],
      level: json["level"],
      kills: json["kills"],
      deaths: json["deaths"],
      assists: json["assists"],
      gpm: json["gpm"],
      xpm: json["xpm"],
      heroHealing: json["hero_healing"],
      heroDamage: json["hero_damage"],
      towerDamage: json["tower_damage"],
      lastHits: json["last_hits"],
      denies: json["denies"],
      gold: json["gold"],
      item0: json["item0"],
      item1: json["item1"],
      item2: json["item2"],
      item3: json["item3"],
      item4: json["item4"],
      item5: json["item5"],
      abandoned: json["abandoned"],
    };
}

export function PlayerInMatchDtoToJSON(value?: PlayerInMatchDto | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    steam_id: value.steamId,
    name: value.name,
    team: value.team,
    hero: value.hero,
    level: value.level,
    kills: value.kills,
    deaths: value.deaths,
    assists: value.assists,
    gpm: value.gpm,
    xpm: value.xpm,
    hero_healing: value.heroHealing,
    hero_damage: value.heroDamage,
    tower_damage: value.towerDamage,
    last_hits: value.lastHits,
    denies: value.denies,
    gold: value.gold,
    item0: value.item0,
    item1: value.item1,
    item2: value.item2,
    item3: value.item3,
    item4: value.item4,
    item5: value.item5,
    abandoned: value.abandoned,
  };
}



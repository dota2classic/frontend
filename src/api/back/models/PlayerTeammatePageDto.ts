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

import {PlayerTeammateDto, PlayerTeammateDtoFromJSON, PlayerTeammateDtoToJSON,} from "./";

/**
 *
 * @export
 * @interface PlayerTeammatePageDto
 */
export interface PlayerTeammatePageDto {
  /**
   *
   * @type {Array<PlayerTeammateDto>}
   * @memberof PlayerTeammatePageDto
   */
  data: Array<PlayerTeammateDto>;
  /**
   *
   * @type {number}
   * @memberof PlayerTeammatePageDto
   */
  page: number;
  /**
   *
   * @type {number}
   * @memberof PlayerTeammatePageDto
   */
  pages: number;
  /**
   *
   * @type {number}
   * @memberof PlayerTeammatePageDto
   */
  perPage: number;
}

export function PlayerTeammatePageDtoFromJSON(
  json: any,
): PlayerTeammatePageDto {
  return PlayerTeammatePageDtoFromJSONTyped(json, false);
}

export function PlayerTeammatePageDtoFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): PlayerTeammatePageDto {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    data: (json["data"] as Array<any>).map(PlayerTeammateDtoFromJSON),
    page: json["page"],
    pages: json["pages"],
    perPage: json["perPage"],
  };
}

export function PlayerTeammatePageDtoToJSON(
  value?: PlayerTeammatePageDto | null,
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    data: (value.data as Array<any>).map(PlayerTeammateDtoToJSON),
    page: value.page,
    pages: value.pages,
    perPage: value.perPage,
  };
}
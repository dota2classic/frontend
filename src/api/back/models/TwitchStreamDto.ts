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
    UserDTO,
    UserDTOFromJSON,
    UserDTOFromJSONTyped,
    UserDTOToJSON,
} from './';

/**
 * 
 * @export
 * @interface TwitchStreamDto
 */
export interface TwitchStreamDto {
    /**
     * 
     * @type {string}
     * @memberof TwitchStreamDto
     */
    link: string;
    /**
     * 
     * @type {string}
     * @memberof TwitchStreamDto
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof TwitchStreamDto
     */
    preview: string;
    /**
     * 
     * @type {number}
     * @memberof TwitchStreamDto
     */
    viewers: number;
    /**
     * 
     * @type {UserDTO}
     * @memberof TwitchStreamDto
     */
    user: UserDTO;
}

export function TwitchStreamDtoFromJSON(json: any): TwitchStreamDto {
    return TwitchStreamDtoFromJSONTyped(json, false);
}

export function TwitchStreamDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): TwitchStreamDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'link': json['link'],
        'title': json['title'],
        'preview': json['preview'],
        'viewers': json['viewers'],
        'user': UserDTOFromJSON(json['user']),
    };
}

export function TwitchStreamDtoToJSON(value?: TwitchStreamDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'link': value.link,
        'title': value.title,
        'preview': value.preview,
        'viewers': value.viewers,
        'user': UserDTOToJSON(value.user),
    };
}



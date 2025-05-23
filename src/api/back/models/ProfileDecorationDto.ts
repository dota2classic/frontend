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
    UploadedImageDto,
    UploadedImageDtoFromJSON,
    UploadedImageDtoFromJSONTyped,
    UploadedImageDtoToJSON,
    UserProfileDecorationType,
    UserProfileDecorationTypeFromJSON,
    UserProfileDecorationTypeFromJSONTyped,
    UserProfileDecorationTypeToJSON,
} from './';

/**
 * 
 * @export
 * @interface ProfileDecorationDto
 */
export interface ProfileDecorationDto {
    /**
     * 
     * @type {UserProfileDecorationType}
     * @memberof ProfileDecorationDto
     */
    type: UserProfileDecorationType;
    /**
     * 
     * @type {number}
     * @memberof ProfileDecorationDto
     */
    id: number;
    /**
     * 
     * @type {UploadedImageDto}
     * @memberof ProfileDecorationDto
     */
    image: UploadedImageDto;
    /**
     * 
     * @type {string}
     * @memberof ProfileDecorationDto
     */
    title: string;
}

export function ProfileDecorationDtoFromJSON(json: any): ProfileDecorationDto {
    return ProfileDecorationDtoFromJSONTyped(json, false);
}

export function ProfileDecorationDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProfileDecorationDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': UserProfileDecorationTypeFromJSON(json['type']),
        'id': json['id'],
        'image': UploadedImageDtoFromJSON(json['image']),
        'title': json['title'],
    };
}

export function ProfileDecorationDtoToJSON(value?: ProfileDecorationDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': UserProfileDecorationTypeToJSON(value.type),
        'id': value.id,
        'image': UploadedImageDtoToJSON(value.image),
        'title': value.title,
    };
}



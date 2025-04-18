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
    BlogpostDto,
    BlogpostDtoFromJSON,
    BlogpostDtoFromJSONTyped,
    BlogpostDtoToJSON,
} from './';

/**
 * 
 * @export
 * @interface BlogPageDto
 */
export interface BlogPageDto {
    /**
     * 
     * @type {number}
     * @memberof BlogPageDto
     */
    page: number;
    /**
     * 
     * @type {number}
     * @memberof BlogPageDto
     */
    perPage: number;
    /**
     * 
     * @type {number}
     * @memberof BlogPageDto
     */
    pages: number;
    /**
     * 
     * @type {Array<BlogpostDto>}
     * @memberof BlogPageDto
     */
    data: Array<BlogpostDto>;
}

export function BlogPageDtoFromJSON(json: any): BlogPageDto {
    return BlogPageDtoFromJSONTyped(json, false);
}

export function BlogPageDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): BlogPageDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'page': json['page'],
        'perPage': json['perPage'],
        'pages': json['pages'],
        'data': ((json['data'] as Array<any>).map(BlogpostDtoFromJSON)),
    };
}

export function BlogPageDtoToJSON(value?: BlogPageDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'page': value.page,
        'perPage': value.perPage,
        'pages': value.pages,
        'data': ((value.data as Array<any>).map(BlogpostDtoToJSON)),
    };
}



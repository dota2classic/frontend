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
    UpdateRuleIndexDto,
    UpdateRuleIndexDtoFromJSON,
    UpdateRuleIndexDtoFromJSONTyped,
    UpdateRuleIndexDtoToJSON,
} from './';

/**
 * 
 * @export
 * @interface UpdateRuleIndicesDto
 */
export interface UpdateRuleIndicesDto {
    /**
     * 
     * @type {Array<UpdateRuleIndexDto>}
     * @memberof UpdateRuleIndicesDto
     */
    updates: Array<UpdateRuleIndexDto>;
}

export function UpdateRuleIndicesDtoFromJSON(json: any): UpdateRuleIndicesDto {
    return UpdateRuleIndicesDtoFromJSONTyped(json, false);
}

export function UpdateRuleIndicesDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateRuleIndicesDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'updates': ((json['updates'] as Array<any>).map(UpdateRuleIndexDtoFromJSON)),
    };
}

export function UpdateRuleIndicesDtoToJSON(value?: UpdateRuleIndicesDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'updates': ((value.updates as Array<any>).map(UpdateRuleIndexDtoToJSON)),
    };
}



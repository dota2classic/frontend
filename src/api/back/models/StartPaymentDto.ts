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
 * @interface StartPaymentDto
 */
export interface StartPaymentDto {
    /**
     * 
     * @type {string}
     * @memberof StartPaymentDto
     */
    confirmationUrl: string;
}

export function StartPaymentDtoFromJSON(json: any): StartPaymentDto {
    return StartPaymentDtoFromJSONTyped(json, false);
}

export function StartPaymentDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): StartPaymentDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'confirmationUrl': json['confirmationUrl'],
    };
}

export function StartPaymentDtoToJSON(value?: StartPaymentDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'confirmationUrl': value.confirmationUrl,
    };
}



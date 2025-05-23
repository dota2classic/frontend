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


import * as runtime from "../runtime";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

import {
  UploadedImageDto,
  UploadedImageDtoFromJSON,
  UploadedImageDtoToJSON,
  UploadedImagePageDto,
  UploadedImagePageDtoFromJSON,
  UploadedImagePageDtoToJSON,
} from "../models";

export interface StorageControllerGetUploadedFilesRequest {
  ctoken?: string;
}

export interface StorageControllerUploadImageRequest {
  file?: Blob;
}

/**
 * 
 */
export class StorageApi extends runtime.BaseAPI {

    /**
     */
    private async storageControllerGetUploadedFilesRaw(requestParameters: StorageControllerGetUploadedFilesRequest): Promise<runtime.ApiResponse<UploadedImagePageDto>> {
        this.storageControllerGetUploadedFilesValidation(requestParameters);
        const context = this.storageControllerGetUploadedFilesContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => UploadedImagePageDtoFromJSON(jsonValue));
    }



    /**
     */
    private storageControllerGetUploadedFilesValidation(requestParameters: StorageControllerGetUploadedFilesRequest) {
    }

    /**
     */
    storageControllerGetUploadedFilesContext(requestParameters: StorageControllerGetUploadedFilesRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        if (requestParameters.ctoken !== undefined) {
            queryParameters["ctoken"] = requestParameters.ctoken;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        return {
            path: `/v1/storage`,
            method: "GET",
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     */
    storageControllerGetUploadedFiles = async (ctoken?: string): Promise<UploadedImagePageDto> => {
        const response = await this.storageControllerGetUploadedFilesRaw({ ctoken: ctoken });
        return await response.value();
    }

    useStorageControllerGetUploadedFiles(ctoken?: string, config?: SWRConfiguration<UploadedImagePageDto, Error>) {
        let valid = true

        const context = this.storageControllerGetUploadedFilesContext({ ctoken: ctoken! });
        return useSWR(context, valid ? () => this.storageControllerGetUploadedFiles(ctoken!) : null, config)
    }

    /**
     */
    private async storageControllerUploadImageRaw(requestParameters: StorageControllerUploadImageRequest): Promise<runtime.ApiResponse<UploadedImageDto>> {
        this.storageControllerUploadImageValidation(requestParameters);
        const context = this.storageControllerUploadImageContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => UploadedImageDtoFromJSON(jsonValue));
    }



    /**
     */
    private storageControllerUploadImageValidation(requestParameters: StorageControllerUploadImageRequest) {
    }

    /**
     */
    storageControllerUploadImageContext(requestParameters: StorageControllerUploadImageRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === "function" ? token("bearer", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const consumes: runtime.Consume[] = [
            { contentType: "multipart/form-data" },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters.file !== undefined) {
            formParams.append("file", requestParameters.file as any);
        }

        return {
            path: `/v1/storage/upload`,
            method: "POST",
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        };
    }

    /**
     */
    storageControllerUploadImage = async (file?: Blob): Promise<UploadedImageDto> => {
        const response = await this.storageControllerUploadImageRaw({ file: file });
        return await response.value();
    }


}

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
  CreateFeedbackDto,
  CreateFeedbackDtoFromJSON,
  CreateFeedbackDtoToJSON,
  CreateFeedbackOptionDto,
  CreateFeedbackOptionDtoFromJSON,
  CreateFeedbackOptionDtoToJSON,
  FeedbackTemplateDto,
  FeedbackTemplateDtoFromJSON,
  FeedbackTemplateDtoToJSON,
  PlayerFeedbackPageDto,
  PlayerFeedbackPageDtoFromJSON,
  PlayerFeedbackPageDtoToJSON,
  UpdateFeedbackDto,
  UpdateFeedbackDtoFromJSON,
  UpdateFeedbackDtoToJSON,
} from "../models";

export interface AdminFeedbackControllerCreateFeedbackRequest {
  createFeedbackDto: CreateFeedbackDto;
}

export interface AdminFeedbackControllerCreateOptionRequest {
  feedbackId: number;
  createFeedbackOptionDto: CreateFeedbackOptionDto;
}

export interface AdminFeedbackControllerDeleteFeedbackRequest {
  feedbackId: number;
}

export interface AdminFeedbackControllerDeleteOptionRequest {
  feedbackId: number;
  id: number;
}

export interface AdminFeedbackControllerEditOptionRequest {
  feedbackId: number;
  id: number;
  createFeedbackOptionDto: CreateFeedbackOptionDto;
}

export interface AdminFeedbackControllerGetFeedbackTemplateRequest {
  feedbackId: number;
}

export interface AdminFeedbackControllerGetPlayerFeedbackRequest {
  page: number;
  perPage?: number;
}

export interface AdminFeedbackControllerUpdateFeedbackRequest {
  feedbackId: number;
  updateFeedbackDto: UpdateFeedbackDto;
}

/**
 * 
 */
export class AdminFeedbackApi extends runtime.BaseAPI {

    /**
     */
    private async adminFeedbackControllerCreateFeedbackRaw(requestParameters: AdminFeedbackControllerCreateFeedbackRequest): Promise<runtime.ApiResponse<FeedbackTemplateDto>> {
        this.adminFeedbackControllerCreateFeedbackValidation(requestParameters);
        const context = this.adminFeedbackControllerCreateFeedbackContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => FeedbackTemplateDtoFromJSON(jsonValue));
    }



    /**
     */
    private adminFeedbackControllerCreateFeedbackValidation(requestParameters: AdminFeedbackControllerCreateFeedbackRequest) {
        if (requestParameters.createFeedbackDto === null || requestParameters.createFeedbackDto === undefined) {
            throw new runtime.RequiredError("createFeedbackDto","Required parameter requestParameters.createFeedbackDto was null or undefined when calling adminFeedbackControllerCreateFeedback.");
        }
    }

    /**
     */
    adminFeedbackControllerCreateFeedbackContext(requestParameters: AdminFeedbackControllerCreateFeedbackRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters["Content-Type"] = "application/json";

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === "function" ? token("bearer", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        return {
            path: `/v1/adminFeedback`,
            method: "POST",
            headers: headerParameters,
            query: queryParameters,
            body: CreateFeedbackDtoToJSON(requestParameters.createFeedbackDto),
        };
    }

    /**
     */
    adminFeedbackControllerCreateFeedback = async (createFeedbackDto: CreateFeedbackDto): Promise<FeedbackTemplateDto> => {
        const response = await this.adminFeedbackControllerCreateFeedbackRaw({ createFeedbackDto: createFeedbackDto });
        return await response.value();
    }


    /**
     */
    private async adminFeedbackControllerCreateOptionRaw(requestParameters: AdminFeedbackControllerCreateOptionRequest): Promise<runtime.ApiResponse<FeedbackTemplateDto>> {
        this.adminFeedbackControllerCreateOptionValidation(requestParameters);
        const context = this.adminFeedbackControllerCreateOptionContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => FeedbackTemplateDtoFromJSON(jsonValue));
    }



    /**
     */
    private adminFeedbackControllerCreateOptionValidation(requestParameters: AdminFeedbackControllerCreateOptionRequest) {
        if (requestParameters.feedbackId === null || requestParameters.feedbackId === undefined) {
            throw new runtime.RequiredError("feedbackId","Required parameter requestParameters.feedbackId was null or undefined when calling adminFeedbackControllerCreateOption.");
        }
        if (requestParameters.createFeedbackOptionDto === null || requestParameters.createFeedbackOptionDto === undefined) {
            throw new runtime.RequiredError("createFeedbackOptionDto","Required parameter requestParameters.createFeedbackOptionDto was null or undefined when calling adminFeedbackControllerCreateOption.");
        }
    }

    /**
     */
    adminFeedbackControllerCreateOptionContext(requestParameters: AdminFeedbackControllerCreateOptionRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters["Content-Type"] = "application/json";

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === "function" ? token("bearer", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        return {
            path: `/v1/adminFeedback/{feedbackId}/option`.replace(`{${"feedbackId"}}`, encodeURIComponent(String(requestParameters.feedbackId))),
            method: "POST",
            headers: headerParameters,
            query: queryParameters,
            body: CreateFeedbackOptionDtoToJSON(requestParameters.createFeedbackOptionDto),
        };
    }

    /**
     */
    adminFeedbackControllerCreateOption = async (feedbackId: number, createFeedbackOptionDto: CreateFeedbackOptionDto): Promise<FeedbackTemplateDto> => {
        const response = await this.adminFeedbackControllerCreateOptionRaw({ feedbackId: feedbackId, createFeedbackOptionDto: createFeedbackOptionDto });
        return await response.value();
    }


    /**
     */
    private async adminFeedbackControllerDeleteFeedbackRaw(requestParameters: AdminFeedbackControllerDeleteFeedbackRequest): Promise<runtime.ApiResponse<void>> {
        this.adminFeedbackControllerDeleteFeedbackValidation(requestParameters);
        const context = this.adminFeedbackControllerDeleteFeedbackContext(requestParameters);
        const response = await this.request(context);

        return new runtime.VoidApiResponse(response);
    }



    /**
     */
    private adminFeedbackControllerDeleteFeedbackValidation(requestParameters: AdminFeedbackControllerDeleteFeedbackRequest) {
        if (requestParameters.feedbackId === null || requestParameters.feedbackId === undefined) {
            throw new runtime.RequiredError("feedbackId","Required parameter requestParameters.feedbackId was null or undefined when calling adminFeedbackControllerDeleteFeedback.");
        }
    }

    /**
     */
    adminFeedbackControllerDeleteFeedbackContext(requestParameters: AdminFeedbackControllerDeleteFeedbackRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === "function" ? token("bearer", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        return {
            path: `/v1/adminFeedback/{feedbackId}`.replace(`{${"feedbackId"}}`, encodeURIComponent(String(requestParameters.feedbackId))),
            method: "DELETE",
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     */
    adminFeedbackControllerDeleteFeedback = async (feedbackId: number): Promise<void> => {
        await this.adminFeedbackControllerDeleteFeedbackRaw({ feedbackId: feedbackId });
    }

    useAdminFeedbackControllerDeleteFeedback(feedbackId: number, config?: SWRConfiguration<void, Error>) {
        let valid = true

        if (feedbackId === null || feedbackId === undefined || Number.isNaN(feedbackId)) {
            valid = false
        }

        const context = this.adminFeedbackControllerDeleteFeedbackContext({ feedbackId: feedbackId! });
        return useSWR(context, valid ? () => this.adminFeedbackControllerDeleteFeedback(feedbackId!) : null, config)
    }

    /**
     */
    private async adminFeedbackControllerDeleteOptionRaw(requestParameters: AdminFeedbackControllerDeleteOptionRequest): Promise<runtime.ApiResponse<FeedbackTemplateDto>> {
        this.adminFeedbackControllerDeleteOptionValidation(requestParameters);
        const context = this.adminFeedbackControllerDeleteOptionContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => FeedbackTemplateDtoFromJSON(jsonValue));
    }



    /**
     */
    private adminFeedbackControllerDeleteOptionValidation(requestParameters: AdminFeedbackControllerDeleteOptionRequest) {
        if (requestParameters.feedbackId === null || requestParameters.feedbackId === undefined) {
            throw new runtime.RequiredError("feedbackId","Required parameter requestParameters.feedbackId was null or undefined when calling adminFeedbackControllerDeleteOption.");
        }
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError("id","Required parameter requestParameters.id was null or undefined when calling adminFeedbackControllerDeleteOption.");
        }
    }

    /**
     */
    adminFeedbackControllerDeleteOptionContext(requestParameters: AdminFeedbackControllerDeleteOptionRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === "function" ? token("bearer", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        return {
            path: `/v1/adminFeedback/{feedbackId}/option/{id}`.replace(`{${"feedbackId"}}`, encodeURIComponent(String(requestParameters.feedbackId))).replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: "DELETE",
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     */
    adminFeedbackControllerDeleteOption = async (feedbackId: number, id: number): Promise<FeedbackTemplateDto> => {
        const response = await this.adminFeedbackControllerDeleteOptionRaw({ feedbackId: feedbackId, id: id });
        return await response.value();
    }

    useAdminFeedbackControllerDeleteOption(feedbackId: number, id: number, config?: SWRConfiguration<FeedbackTemplateDto, Error>) {
        let valid = true

        if (feedbackId === null || feedbackId === undefined || Number.isNaN(feedbackId)) {
            valid = false
        }

        if (id === null || id === undefined || Number.isNaN(id)) {
            valid = false
        }

        const context = this.adminFeedbackControllerDeleteOptionContext({ feedbackId: feedbackId!, id: id! });
        return useSWR(context, valid ? () => this.adminFeedbackControllerDeleteOption(feedbackId!, id!) : null, config)
    }

    /**
     */
    private async adminFeedbackControllerEditOptionRaw(requestParameters: AdminFeedbackControllerEditOptionRequest): Promise<runtime.ApiResponse<FeedbackTemplateDto>> {
        this.adminFeedbackControllerEditOptionValidation(requestParameters);
        const context = this.adminFeedbackControllerEditOptionContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => FeedbackTemplateDtoFromJSON(jsonValue));
    }



    /**
     */
    private adminFeedbackControllerEditOptionValidation(requestParameters: AdminFeedbackControllerEditOptionRequest) {
        if (requestParameters.feedbackId === null || requestParameters.feedbackId === undefined) {
            throw new runtime.RequiredError("feedbackId","Required parameter requestParameters.feedbackId was null or undefined when calling adminFeedbackControllerEditOption.");
        }
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError("id","Required parameter requestParameters.id was null or undefined when calling adminFeedbackControllerEditOption.");
        }
        if (requestParameters.createFeedbackOptionDto === null || requestParameters.createFeedbackOptionDto === undefined) {
            throw new runtime.RequiredError("createFeedbackOptionDto","Required parameter requestParameters.createFeedbackOptionDto was null or undefined when calling adminFeedbackControllerEditOption.");
        }
    }

    /**
     */
    adminFeedbackControllerEditOptionContext(requestParameters: AdminFeedbackControllerEditOptionRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters["Content-Type"] = "application/json";

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === "function" ? token("bearer", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        return {
            path: `/v1/adminFeedback/{feedbackId}/option/{id}`.replace(`{${"feedbackId"}}`, encodeURIComponent(String(requestParameters.feedbackId))).replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: "PATCH",
            headers: headerParameters,
            query: queryParameters,
            body: CreateFeedbackOptionDtoToJSON(requestParameters.createFeedbackOptionDto),
        };
    }

    /**
     */
    adminFeedbackControllerEditOption = async (feedbackId: number, id: number, createFeedbackOptionDto: CreateFeedbackOptionDto): Promise<FeedbackTemplateDto> => {
        const response = await this.adminFeedbackControllerEditOptionRaw({ feedbackId: feedbackId, id: id, createFeedbackOptionDto: createFeedbackOptionDto });
        return await response.value();
    }


    /**
     */
    private async adminFeedbackControllerGetFeedbackTemplateRaw(requestParameters: AdminFeedbackControllerGetFeedbackTemplateRequest): Promise<runtime.ApiResponse<FeedbackTemplateDto>> {
        this.adminFeedbackControllerGetFeedbackTemplateValidation(requestParameters);
        const context = this.adminFeedbackControllerGetFeedbackTemplateContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => FeedbackTemplateDtoFromJSON(jsonValue));
    }



    /**
     */
    private adminFeedbackControllerGetFeedbackTemplateValidation(requestParameters: AdminFeedbackControllerGetFeedbackTemplateRequest) {
        if (requestParameters.feedbackId === null || requestParameters.feedbackId === undefined) {
            throw new runtime.RequiredError("feedbackId","Required parameter requestParameters.feedbackId was null or undefined when calling adminFeedbackControllerGetFeedbackTemplate.");
        }
    }

    /**
     */
    adminFeedbackControllerGetFeedbackTemplateContext(requestParameters: AdminFeedbackControllerGetFeedbackTemplateRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === "function" ? token("bearer", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        return {
            path: `/v1/adminFeedback/{feedbackId}`.replace(`{${"feedbackId"}}`, encodeURIComponent(String(requestParameters.feedbackId))),
            method: "GET",
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     */
    adminFeedbackControllerGetFeedbackTemplate = async (feedbackId: number): Promise<FeedbackTemplateDto> => {
        const response = await this.adminFeedbackControllerGetFeedbackTemplateRaw({ feedbackId: feedbackId });
        return await response.value();
    }

    useAdminFeedbackControllerGetFeedbackTemplate(feedbackId: number, config?: SWRConfiguration<FeedbackTemplateDto, Error>) {
        let valid = true

        if (feedbackId === null || feedbackId === undefined || Number.isNaN(feedbackId)) {
            valid = false
        }

        const context = this.adminFeedbackControllerGetFeedbackTemplateContext({ feedbackId: feedbackId! });
        return useSWR(context, valid ? () => this.adminFeedbackControllerGetFeedbackTemplate(feedbackId!) : null, config)
    }

    /**
     */
    private async adminFeedbackControllerGetFeedbacksRaw(): Promise<runtime.ApiResponse<Array<FeedbackTemplateDto>>> {
        this.adminFeedbackControllerGetFeedbacksValidation();
        const context = this.adminFeedbackControllerGetFeedbacksContext();
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(FeedbackTemplateDtoFromJSON));
    }



    /**
     */
    private adminFeedbackControllerGetFeedbacksValidation() {
    }

    /**
     */
    adminFeedbackControllerGetFeedbacksContext(): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === "function" ? token("bearer", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        return {
            path: `/v1/adminFeedback`,
            method: "GET",
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     */
    adminFeedbackControllerGetFeedbacks = async (): Promise<Array<FeedbackTemplateDto>> => {
        const response = await this.adminFeedbackControllerGetFeedbacksRaw();
        return await response.value();
    }

    useAdminFeedbackControllerGetFeedbacks(config?: SWRConfiguration<Array<FeedbackTemplateDto>, Error>) {
        let valid = true

        const context = this.adminFeedbackControllerGetFeedbacksContext();
        return useSWR(context, valid ? () => this.adminFeedbackControllerGetFeedbacks() : null, config)
    }

    /**
     */
    private async adminFeedbackControllerGetPlayerFeedbackRaw(requestParameters: AdminFeedbackControllerGetPlayerFeedbackRequest): Promise<runtime.ApiResponse<PlayerFeedbackPageDto>> {
        this.adminFeedbackControllerGetPlayerFeedbackValidation(requestParameters);
        const context = this.adminFeedbackControllerGetPlayerFeedbackContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => PlayerFeedbackPageDtoFromJSON(jsonValue));
    }



    /**
     */
    private adminFeedbackControllerGetPlayerFeedbackValidation(requestParameters: AdminFeedbackControllerGetPlayerFeedbackRequest) {
        if (requestParameters.page === null || requestParameters.page === undefined) {
            throw new runtime.RequiredError("page","Required parameter requestParameters.page was null or undefined when calling adminFeedbackControllerGetPlayerFeedback.");
        }
    }

    /**
     */
    adminFeedbackControllerGetPlayerFeedbackContext(requestParameters: AdminFeedbackControllerGetPlayerFeedbackRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        if (requestParameters.page !== undefined) {
            queryParameters["page"] = requestParameters.page;
        }

        if (requestParameters.perPage !== undefined) {
            queryParameters["per_page"] = requestParameters.perPage;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === "function" ? token("bearer", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        return {
            path: `/v1/adminFeedback/playerFeedback`,
            method: "GET",
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     */
    adminFeedbackControllerGetPlayerFeedback = async (page: number, perPage?: number): Promise<PlayerFeedbackPageDto> => {
        const response = await this.adminFeedbackControllerGetPlayerFeedbackRaw({ page: page, perPage: perPage });
        return await response.value();
    }

    useAdminFeedbackControllerGetPlayerFeedback(page: number, perPage?: number, config?: SWRConfiguration<PlayerFeedbackPageDto, Error>) {
        let valid = true

        if (page === null || page === undefined || Number.isNaN(page)) {
            valid = false
        }

        const context = this.adminFeedbackControllerGetPlayerFeedbackContext({ page: page!, perPage: perPage! });
        return useSWR(context, valid ? () => this.adminFeedbackControllerGetPlayerFeedback(page!, perPage!) : null, config)
    }

    /**
     */
    private async adminFeedbackControllerUpdateFeedbackRaw(requestParameters: AdminFeedbackControllerUpdateFeedbackRequest): Promise<runtime.ApiResponse<FeedbackTemplateDto>> {
        this.adminFeedbackControllerUpdateFeedbackValidation(requestParameters);
        const context = this.adminFeedbackControllerUpdateFeedbackContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => FeedbackTemplateDtoFromJSON(jsonValue));
    }



    /**
     */
    private adminFeedbackControllerUpdateFeedbackValidation(requestParameters: AdminFeedbackControllerUpdateFeedbackRequest) {
        if (requestParameters.feedbackId === null || requestParameters.feedbackId === undefined) {
            throw new runtime.RequiredError("feedbackId","Required parameter requestParameters.feedbackId was null or undefined when calling adminFeedbackControllerUpdateFeedback.");
        }
        if (requestParameters.updateFeedbackDto === null || requestParameters.updateFeedbackDto === undefined) {
            throw new runtime.RequiredError("updateFeedbackDto","Required parameter requestParameters.updateFeedbackDto was null or undefined when calling adminFeedbackControllerUpdateFeedback.");
        }
    }

    /**
     */
    adminFeedbackControllerUpdateFeedbackContext(requestParameters: AdminFeedbackControllerUpdateFeedbackRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters["Content-Type"] = "application/json";

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === "function" ? token("bearer", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        return {
            path: `/v1/adminFeedback/{feedbackId}`.replace(`{${"feedbackId"}}`, encodeURIComponent(String(requestParameters.feedbackId))),
            method: "PATCH",
            headers: headerParameters,
            query: queryParameters,
            body: UpdateFeedbackDtoToJSON(requestParameters.updateFeedbackDto),
        };
    }

    /**
     */
    adminFeedbackControllerUpdateFeedback = async (feedbackId: number, updateFeedbackDto: UpdateFeedbackDto): Promise<FeedbackTemplateDto> => {
        const response = await this.adminFeedbackControllerUpdateFeedbackRaw({ feedbackId: feedbackId, updateFeedbackDto: updateFeedbackDto });
        return await response.value();
    }


}

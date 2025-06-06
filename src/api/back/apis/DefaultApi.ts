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


/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     */
    private async paymentHooksControllerRedirectRaw(): Promise<runtime.ApiResponse<void>> {
        this.paymentHooksControllerRedirectValidation();
        const context = this.paymentHooksControllerRedirectContext();
        const response = await this.request(context);

        return new runtime.VoidApiResponse(response);
    }



    /**
     */
    private paymentHooksControllerRedirectValidation() {
    }

    /**
     */
    paymentHooksControllerRedirectContext(): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        return {
            path: `/v1/payment_web_hook/redirect`,
            method: "GET",
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     */
    paymentHooksControllerRedirect = async (): Promise<void> => {
        await this.paymentHooksControllerRedirectRaw();
    }

    usePaymentHooksControllerRedirect(config?: SWRConfiguration<void, Error>) {
        let valid = true

        const context = this.paymentHooksControllerRedirectContext();
        return useSWR(context, valid ? () => this.paymentHooksControllerRedirect() : null, config)
    }

    /**
     */
    private async paymentHooksControllerYoukassaNotificationWebhookRaw(): Promise<runtime.ApiResponse<void>> {
        this.paymentHooksControllerYoukassaNotificationWebhookValidation();
        const context = this.paymentHooksControllerYoukassaNotificationWebhookContext();
        const response = await this.request(context);

        return new runtime.VoidApiResponse(response);
    }



    /**
     */
    private paymentHooksControllerYoukassaNotificationWebhookValidation() {
    }

    /**
     */
    paymentHooksControllerYoukassaNotificationWebhookContext(): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        return {
            path: `/v1/payment_web_hook`,
            method: "POST",
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     */
    paymentHooksControllerYoukassaNotificationWebhook = async (): Promise<void> => {
        await this.paymentHooksControllerYoukassaNotificationWebhookRaw();
    }


}

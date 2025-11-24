/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import { logger } from "matrix-js-sdk/src/logger";

export interface OTPRequestResponse {
    success: boolean;
    message?: string;
}

export interface OTPVerifyResponse {
    success: boolean;
    access_token?: string;
    message?: string;
    device_id?: string;
    home_server?: string;
    user_id?: string;
    well_known?: Record<string, { base_url: string }>;
}


export class OTPAuth {
    private static readonly AUTH_ENDPOINT = "/_synapse/client/authentication";
    private static readonly VERIFY_ENDPOINT = "/_synapse/client/authentication/verify";

    /**
     * Request OTP for phone number authentication
     * @param homeserverUrl - The homeserver URL
     * @param phoneNumber - Phone number in international format (e.g., "989121234567")
     * @returns Promise with OTP request response
     */
    public static async requestOTP(homeserverUrl: string, phoneNumber: string): Promise<OTPRequestResponse> {
        try {
            const response = await fetch(`${homeserverUrl}${this.AUTH_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                success: true,
                message: data.message,
            };
        } catch (error) {
            logger.error("Failed to request OTP:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error occurred",
            };
        }
    }

    /**
     * Verify OTP code and get login token
     * @param homeserverUrl - The homeserver URL
     * @param phoneNumber - Phone number in international format
     * @param otp - The OTP code received
     * @returns Promise with OTP verification response
     */
    public static async verifyOTP(
        homeserverUrl: string,
        phoneNumber: string,
        otp: string,
    ): Promise<OTPVerifyResponse> {
        try {
            const response = await fetch(`${homeserverUrl}${this.VERIFY_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    otp: otp,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                access_token: data.access_token,
                message: data.message,
                well_known: data.well_known,
                device_id: data.device_id,
                home_server: data.home_server,
                user_id: data.user_id,
                success: true,
            };
        } catch (error) {
            logger.error("Failed to verify OTP:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error occurred",
            };
        }
    }
}

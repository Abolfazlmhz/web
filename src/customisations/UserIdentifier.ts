/*
Copyright 2024 New Vector Ltd.
Copyright 2022 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import type { UserIdentifierCustomisations } from "@element-hq/element-web-module-api";

/**
 * Customise display of the user identifier
 * hide userId for guests, display 3pid
 *
 * Set withDisplayName to true when user identifier will be displayed alongside user name
 */
function getDisplayUserIdentifier(
    userId: string,
    { roomId, withDisplayName }: { roomId?: string; withDisplayName?: boolean },
): string | null {
    // Extract phone number from Matrix user ID format: @u<phonenumber>:<domain>
    // Remove @ and split by : to get localpart
    const localpart = userId.startsWith('@') ? userId.substring(1).split(':')[0] : userId.split(':')[0];

    // Remove 'u' prefix if present to get just the phone number
    if (localpart.startsWith('u')) {
        return localpart.substring(1);
    }

    return localpart;
}

// A real customisation module will define and export one or more of the
// customisation points that make up `IUserIdentifierCustomisations`.
export default {
    getDisplayUserIdentifier,
} as UserIdentifierCustomisations;

/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { type ReactNode, useEffect } from "react";

import { useIsMobile } from "../../../hooks/useMobileCheck";
import { MobileNavProvider, useMobileNav } from "./MobileNavContext";
import MobileLayout from "./MobileLayout";
import PageTypes from "../../../PageTypes";

interface Props {
    /** The full desktop layout (everything inside mx_MatrixChat) */
    desktopLayout: ReactNode;
    /** The chat list element for mobile (LeftPanel + wrapper) */
    chatListElement: ReactNode;
    /** The room view / home page element for mobile */
    chatRoomElement: ReactNode;
    /** Current page type from props */
    pageType?: string;
    /** Current room ID */
    currentRoomId: string | null;
    /** Whether services page is open */
    isServicesOpen: boolean;
    /** Whether agriculture page is open */
    isAgricultureOpen: boolean;
    /** Whether a right panel card is open */
    showRightPanel: boolean;
    /** The right panel phase */
    rightPanelPhase: string | null;
}

/**
 * Inner component that syncs external state changes to mobile nav.
 * This bridges the old store-based navigation with the new context.
 */
const MobileNavSync: React.FC<Props> = (props) => {
    const { navigate, currentPage } = useMobileNav();
    const isMobile = useIsMobile();

    // Sync external store-initiated navigation to mobile nav.
    // Only reacts to panels being OPENED — closing is handled by goBack() in MobileLayout.
    useEffect(() => {
        if (!isMobile) return;

        if (props.isServicesOpen) {
            if (currentPage !== "services") navigate("services");
        } else if (props.isAgricultureOpen) {
            if (currentPage !== "agriculture") navigate("agriculture");
        } else if (props.showRightPanel) {
            const phase = props.rightPanelPhase;
            if (phase === "CardToCard" && currentPage !== "cardToCard") navigate("cardToCard");
            else if (phase === "ChargePurchase" && currentPage !== "chargePurchase") navigate("chargePurchase");
            else if (phase === "BillPayment" && currentPage !== "billPayment") navigate("billPayment");
        }
    }, [
        isMobile,
        props.isServicesOpen,
        props.isAgricultureOpen,
        props.showRightPanel,
        props.rightPanelPhase,
    ]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync room navigation separately — only when entering a room
    useEffect(() => {
        if (!isMobile) return;
        if (props.pageType === PageTypes.RoomView && props.currentRoomId && currentPage !== "chatRoom") {
            navigate("chatRoom");
        }
    }, [isMobile, props.pageType, props.currentRoomId]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!isMobile) {
        return <>{props.desktopLayout}</>;
    }

    return (
        <MobileLayout
            chatListElement={props.chatListElement}
            chatRoomElement={props.chatRoomElement}
        />
    );
};

const MobileAwareLayout: React.FC<Props> = (props) => {
    return (
        <MobileNavProvider>
            <MobileNavSync {...props} />
        </MobileNavProvider>
    );
};

export default MobileAwareLayout;

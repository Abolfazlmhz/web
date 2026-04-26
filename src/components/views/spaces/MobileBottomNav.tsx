/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React from "react";
import classNames from "classnames";

import { _t, type TranslationKey } from "../../../languageHandler";
import RightPanelStore from "../../../stores/right-panel/RightPanelStore";
import { RightPanelPhases } from "../../../stores/right-panel/RightPanelStorePhases";
import { useEventEmitterState } from "../../../hooks/useEventEmitter";
import { UPDATE_EVENT } from "../../../stores/AsyncStore";
import SpaceStore from "../../../stores/spaces/SpaceStore";
import { MetaSpace } from "../../../stores/spaces";
import defaultDispatcher from "../../../dispatcher/dispatcher";
import { Action } from "../../../dispatcher/actions";

type Tab = "chat" | "agriculture" | "services" | "more";

const MobileBottomNav: React.FC = () => {
    const currentCard = useEventEmitterState(
        RightPanelStore.instance,
        UPDATE_EVENT,
        () => RightPanelStore.instance.currentCard,
    );

    const isServices = currentCard.phase === RightPanelPhases.Services && RightPanelStore.instance.isOpen;
    const isAgriculture = currentCard.phase === RightPanelPhases.Agriculture && RightPanelStore.instance.isOpen;

    let activeTab: Tab = "chat";
    if (isServices) activeTab = "services";
    else if (isAgriculture) activeTab = "agriculture";

    const onTabClick = (tab: Tab): void => {
        switch (tab) {
            case "chat":
                // Navigate back to room list / home page
                RightPanelStore.instance.hide(null);
                SpaceStore.instance.setActiveSpace(MetaSpace.Home);
                defaultDispatcher.dispatch({ action: Action.ViewHomePage });
                break;
            case "agriculture":
                RightPanelStore.instance.setCard({ phase: RightPanelPhases.Agriculture }, true, undefined);
                break;
            case "services":
                RightPanelStore.instance.setCard({ phase: RightPanelPhases.Services }, true, undefined);
                break;
            case "more":
                // TODO: implement more menu
                break;
        }
    };

    return (
        <nav className="mx_MobileBottomNav">
            <button
                className={classNames("mx_MobileBottomNav_tab", { active: activeTab === "chat" })}
                onClick={() => onTabClick("chat")}
            >
                <div className="mx_MobileBottomNav_icon mx_MobileBottomNav_icon_chat" />
                <span className="mx_MobileBottomNav_label">{_t("common|social" as TranslationKey)}</span>
            </button>
            <button
                className={classNames("mx_MobileBottomNav_tab", { active: activeTab === "agriculture" })}
                onClick={() => onTabClick("agriculture")}
            >
                <div className="mx_MobileBottomNav_icon mx_MobileBottomNav_icon_agriculture" />
                <span className="mx_MobileBottomNav_label">{_t("custom_panels|agriculture")}</span>
            </button>
            <button
                className={classNames("mx_MobileBottomNav_tab", { active: activeTab === "services" })}
                onClick={() => onTabClick("services")}
            >
                <div className="mx_MobileBottomNav_icon mx_MobileBottomNav_icon_services" />
                <span className="mx_MobileBottomNav_label">{_t("custom_panels|services")}</span>
            </button>
            <button
                className="mx_MobileBottomNav_tab"
                onClick={() => onTabClick("more")}
            >
                <div className="mx_MobileBottomNav_icon mx_MobileBottomNav_icon_more" />
                <span className="mx_MobileBottomNav_label">{_t("common|more" as TranslationKey)}</span>
            </button>
        </nav>
    );
};

export default MobileBottomNav;

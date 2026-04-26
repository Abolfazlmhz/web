/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React from "react";
import classNames from "classnames";

import { _t, type TranslationKey } from "../../../languageHandler";
import { useMobileNav } from "../../structures/mobile/MobileNavContext";

const MobileBottomNav: React.FC = () => {
    const { activeTab, navigate } = useMobileNav();

    return (
        <nav className="mx_MobileBottomNav">
            <button
                className={classNames("mx_MobileBottomNav_tab", { active: activeTab === "chat" })}
                onClick={() => navigate("chatList")}
            >
                <div className="mx_MobileBottomNav_icon mx_MobileBottomNav_icon_chat" />
                <span className="mx_MobileBottomNav_label">{_t("common|social" as TranslationKey)}</span>
            </button>
            <button
                className={classNames("mx_MobileBottomNav_tab", { active: activeTab === "agriculture" })}
                onClick={() => navigate("agriculture")}
            >
                <div className="mx_MobileBottomNav_icon mx_MobileBottomNav_icon_agriculture" />
                <span className="mx_MobileBottomNav_label">{_t("custom_panels|agriculture")}</span>
            </button>
            <button
                className={classNames("mx_MobileBottomNav_tab", { active: activeTab === "services" })}
                onClick={() => navigate("services")}
            >
                <div className="mx_MobileBottomNav_icon mx_MobileBottomNav_icon_services" />
                <span className="mx_MobileBottomNav_label">{_t("custom_panels|services")}</span>
            </button>
            <button
                className="mx_MobileBottomNav_tab"
                onClick={() => {}}
            >
                <div className="mx_MobileBottomNav_icon mx_MobileBottomNav_icon_more" />
                <span className="mx_MobileBottomNav_label">{_t("common|more" as TranslationKey)}</span>
            </button>
        </nav>
    );
};

export default MobileBottomNav;

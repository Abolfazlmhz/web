/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { useContext } from "react";
import { Icon as ConsultantIcon } from "../../../../res/img/element-icons/agriculture-consultant.svg";
import { Icon as OrganizationIcon } from "../../../../res/img/element-icons/agriculture-organization.svg";
import { Icon as MarketIcon } from "../../../../res/img/element-icons/agriculture-market.svg";
import { Icon as EducationIcon } from "../../../../res/img/element-icons/agriculture-education.svg";
import { Icon as ClimateIcon } from "../../../../res/img/element-icons/agriculture-climate.svg";
import { Icon as ClubIcon } from "../../../../res/img/element-icons/agriculture-club.svg";
import { Icon as InsuranceIcon } from "../../../../res/img/element-icons/agriculture-insurance.svg";
import { Icon as BazaarIcon } from "../../../../res/img/element-icons/agriculture-bazaar.svg";

import "../../../../res/css/views/agriculture/AgriculturePage.pcss";
import MatrixClientContext from "../../../contexts/MatrixClientContext";
import { DirectoryMember, startDmOnFirstMessage } from "../../../utils/direct-messages";
import { _t } from "../../../languageHandler";

interface AgricultureCardProps {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    disabled?: boolean;
    onClick?: () => void;
}

const AgricultureCard: React.FC<AgricultureCardProps> = ({ title, icon: Icon, disabled = false, onClick }) => {
    return (
        <div
            className={`mx_AgriculturePage_card ${disabled ? "mx_AgriculturePage_card_disabled" : ""}`}
            onClick={disabled ? undefined : onClick}
            role={disabled ? undefined : "button"}
            tabIndex={disabled ? undefined : 0}
        >
            <div className="mx_AgriculturePage_card_icon">
                <Icon className="mx_AgriculturePage_card_icon_svg" />
            </div>
            <div className="mx_AgriculturePage_card_content">
                <h3 className="mx_AgriculturePage_card_title">{title}</h3>
                {disabled && (
                    <span className="mx_AgriculturePage_card_badge">
                        {_t("custom_panels|coming_soon")}
                    </span>
                )}
            </div>
        </div>
    );
};

const AgriculturePage: React.FC = () => {
    const cli = useContext(MatrixClientContext);

    const handleMarketClick = async (userId: string): Promise<void> => {
        const advertiseBot = new DirectoryMember({
            user_id: userId,
        });
        await startDmOnFirstMessage(cli, [advertiseBot]);
    };

    return (
        <div className="mx_AgriculturePage">
            <div className="mx_AgriculturePage_container">
                <div className="mx_AgriculturePage_grid">
                    <AgricultureCard
                        title={_t("custom_panels|agriculture_consultant")}
                        icon={ConsultantIcon}
                        onClick={() => handleMarketClick("@useller:agridemo.ir")}
                    />
                    <AgricultureCard
                        title={_t("custom_panels|agriculture_organizations")}
                        icon={OrganizationIcon}
                        disabled={true}
                    />
                    <AgricultureCard
                        title={_t("custom_panels|agriculture_market")}
                        icon={MarketIcon}
                        onClick={() => handleMarketClick("@advertisebot:agridemo.ir")}
                    />
                    <AgricultureCard
                        title={_t("custom_panels|agriculture_education")}
                        icon={EducationIcon}
                        disabled={true}
                    />
                    <AgricultureCard
                        title={_t("custom_panels|agriculture_climate")}
                        icon={ClimateIcon}
                        disabled={true}
                    />
                    <AgricultureCard
                        title={_t("custom_panels|agriculture_club")}
                        icon={ClubIcon}
                        disabled={true}
                    />
                    <AgricultureCard
                        title={_t("custom_panels|agriculture_insurance")}
                        icon={InsuranceIcon}
                        disabled={true}
                    />
                    <AgricultureCard
                        title={_t("custom_panels|agriculture_bazaar")}
                        icon={BazaarIcon}
                        disabled={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default AgriculturePage;

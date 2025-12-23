/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React from "react";
import { Icon as ConsultantIcon } from "../../../../res/img/element-icons/agriculture-consultant.svg";
import { Icon as OrganizationIcon } from "../../../../res/img/element-icons/agriculture-organization.svg";
import { Icon as MarketIcon } from "../../../../res/img/element-icons/agriculture-market.svg";
import { Icon as EducationIcon } from "../../../../res/img/element-icons/agriculture-education.svg";
import { Icon as ClimateIcon } from "../../../../res/img/element-icons/agriculture-climate.svg";
import { Icon as ClubIcon } from "../../../../res/img/element-icons/agriculture-club.svg";
import { Icon as InsuranceIcon } from "../../../../res/img/element-icons/agriculture-insurance.svg";
import { Icon as BazaarIcon } from "../../../../res/img/element-icons/agriculture-bazaar.svg";

import "../../../../res/css/views/agriculture/AgriculturePage.pcss";

interface AgricultureCardProps {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const AgricultureCard: React.FC<AgricultureCardProps> = ({ title, icon: Icon }) => {
    return (
        <div className="mx_AgriculturePage_card">
            <div className="mx_AgriculturePage_card_icon">
                <Icon className="mx_AgriculturePage_card_icon_svg" />
            </div>
            <div className="mx_AgriculturePage_card_content">
                <h3 className="mx_AgriculturePage_card_title">{title}</h3>
            </div>
        </div>
    );
};

const AgriculturePage: React.FC = () => {
    return (
        <div className="mx_AgriculturePage">
            <div className="mx_AgriculturePage_container">
                <div className="mx_AgriculturePage_grid">
                    <AgricultureCard
                        title="مشاور کشاورز"
                        icon={ConsultantIcon}
                    />
                    <AgricultureCard
                        title="تعامل با سازمان ها"
                        icon={OrganizationIcon}
                    />
                    <AgricultureCard
                        title="بازارگاه"
                        icon={MarketIcon}
                    />
                    <AgricultureCard
                        title="آموزش و مشاوره تخصصی"
                        icon={EducationIcon}
                    />
                    <AgricultureCard
                        title="شرایط اقلیمی"
                        icon={ClimateIcon}
                    />
                    <AgricultureCard
                        title="باشگاه کشاورزان"
                        icon={ClubIcon}
                    />
                    <AgricultureCard
                        title="بیمه کشاورزی"
                        icon={InsuranceIcon}
                    />
                    <AgricultureCard
                        title="بازارچه"
                        icon={BazaarIcon}
                    />
                </div>
            </div>
        </div>
    );
};

export default AgriculturePage;


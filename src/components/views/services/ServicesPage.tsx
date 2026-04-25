/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React from "react";
import AccessibleButton from "../elements/AccessibleButton";
import RightPanelStore from "../../../stores/right-panel/RightPanelStore";
import { RightPanelPhases } from "../../../stores/right-panel/RightPanelStorePhases";
import LinkIcon from "@vector-im/compound-design-tokens/assets/web/icons/link";
import { Icon as ChargeIcon } from "../../../../res/img/element-icons/charge.svg";
import { Icon as BillIcon } from "../../../../res/img/element-icons/bill.svg";
import { _t } from "../../../languageHandler";

import "../../../../res/css/views/services/ServicesPage.pcss";

interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon: Icon, onClick }) => {
    return (
        <AccessibleButton className="mx_ServicesPage_card" onClick={onClick} element="div">
            <div className="mx_ServicesPage_card_icon">
                <Icon className="mx_ServicesPage_card_icon_svg" />
            </div>
            <div className="mx_ServicesPage_card_content">
                <h3 className="mx_ServicesPage_card_title">{title}</h3>
                <p className="mx_ServicesPage_card_description">{description}</p>
            </div>
        </AccessibleButton>
    );
};

const ServicesPage: React.FC = () => {
    const onCardToCardClick = (): void => {
        RightPanelStore.instance.setCard({ phase: RightPanelPhases.CardToCard }, true, undefined);
    };
    const onChargePurchaseClick = (): void => {
        RightPanelStore.instance.setCard({ phase: RightPanelPhases.ChargePurchase }, true, undefined);
    };
    const onBillPaymentClick = (): void => {
        RightPanelStore.instance.setCard({ phase: RightPanelPhases.BillPayment }, true, undefined);
    };

    return (
        <div className="mx_ServicesPage">
            <div className="mx_ServicesPage_container">
                <h1 className="mx_ServicesPage_title">{_t("custom_panels|services_title")}</h1>
                <div className="mx_ServicesPage_grid">
                    <ServiceCard
                        title={_t("custom_panels|card_to_card")}
                        description={_t("custom_panels|card_to_card_desc")}
                        icon={LinkIcon}
                        onClick={onCardToCardClick}
                    />
                    <ServiceCard
                        title={_t("custom_panels|charge_purchase")}
                        description={_t("custom_panels|charge_purchase_desc")}
                        icon={ChargeIcon}
                        onClick={onChargePurchaseClick}
                    />
                    <ServiceCard
                        title={_t("custom_panels|bill_payment")}
                        description={_t("custom_panels|bill_payment_desc")}
                        icon={BillIcon}
                        onClick={onBillPaymentClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;

/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { useEffect, useRef, useState } from "react";
import { _t } from "../../../languageHandler";
import Modal from "../../../Modal";
import ErrorDialog from "../dialogs/ErrorDialog";
import InfoDialog from "../dialogs/InfoDialog";
import Spinner from "../elements/Spinner";
import CheckCircleIcon from "@vector-im/compound-design-tokens/assets/web/icons/check-circle-solid";
import { IconButton } from "@vector-im/compound-web";
import CloseIcon from "@vector-im/compound-design-tokens/assets/web/icons/close";

interface Props {
    onClose(): void;
}

const CardToCardCard: React.FC<Props> = ({ onClose }) => {
    const [card1, setCard1] = useState("");
    const [card2, setCard2] = useState("");
    const [card3, setCard3] = useState("");
    const [card4, setCard4] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cvv2, setCvv2] = useState("");
    const [otp, setOtp] = useState("");
    const [otpTimer, setOtpTimer] = useState(0);
    const [isOtpDisabled, setIsOtpDisabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const progressDialogRef = useRef<{ close: () => void } | null>(null);

    const card1Ref = useRef<HTMLInputElement>(null);
    const card2Ref = useRef<HTMLInputElement>(null);
    const card3Ref = useRef<HTMLInputElement>(null);
    const card4Ref = useRef<HTMLInputElement>(null);
    const expMonthRef = useRef<HTMLInputElement>(null);
    const expYearRef = useRef<HTMLInputElement>(null);
    const cvv2Ref = useRef<HTMLInputElement>(null);
    const otpRef = useRef<HTMLInputElement>(null);

    // Auto-focus first card input
    useEffect(() => {
        card1Ref.current?.focus();
    }, []);

    // Auto-advance card inputs
    useEffect(() => {
        if (card1.length === 4) card2Ref.current?.focus();
    }, [card1]);

    useEffect(() => {
        if (card2.length === 4) card3Ref.current?.focus();
    }, [card2]);

    useEffect(() => {
        if (card3.length === 4) card4Ref.current?.focus();
    }, [card3]);

    // Auto-advance expiry inputs
    useEffect(() => {
        if (expMonth.length === 2) expYearRef.current?.focus();
    }, [expMonth]);

    useEffect(() => {
        if (expYear.length === 2) cvv2Ref.current?.focus();
    }, [expYear]);

    useEffect(() => {
        if (cvv2.length >= 3) otpRef.current?.focus();
    }, [cvv2]);

    // OTP timer
    useEffect(() => {
        if (otpTimer > 0) {
            const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else if (otpTimer === 0 && isOtpDisabled) {
            setIsOtpDisabled(false);
        }
    }, [otpTimer, isOtpDisabled]);

    const forceNumeric = (value: string): string => {
        return value.replace(/[^0-9]/g, "");
    };

    const handleCardInput = (value: string, setter: (val: string) => void, maxLength: number) => {
        const numeric = forceNumeric(value);
        if (numeric.length <= maxLength) {
            setter(numeric);
        }
    };

    const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Convert Persian digits to English digits, then remove all non-numeric characters
        const persianToEnglish = inputValue
            .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
            .replace(/[^0-9]/g, "");

        if (persianToEnglish) {
            const numValue = Number(persianToEnglish);
            setAmount(numValue.toLocaleString("fa-IR"));
        } else {
            setAmount("");
        }
    };

    const handleGetOtp = () => {
        if (isOtpDisabled) return;

        Modal.createDialog(InfoDialog, {
            title: "رمز پویا ارسال شد!",
            description: "رمز به شماره همراه شما پیامک شد",
            hasCloseButton: true,
        });

        // Fill OTP for testing
        setOtp("483920");

        // Disable button and start timer
        setIsOtpDisabled(true);
        setOtpTimer(60);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const fullCard = `${card1.padStart(4, "0")}-${card2.padStart(4, "0")}-${card3.padStart(4, "0")}-${card4.padStart(4, "0")}`;
        const cardNumber = fullCard.replace(/-/g, "");

        if (cardNumber.length !== 16 || !amount || amount === "۰") {
            Modal.createDialog(ErrorDialog, {
                title: "خطا",
                description: "لطفاً شماره کارت و مبلغ را کامل وارد کنید",
            });
            return;
        }

        setIsSubmitting(true);

        // Show progress dialog
        const progressDialog = Modal.createDialog(
            InfoDialog,
            {
                title: "در حال انتقال...",
                description: (
                    <div style={{ textAlign: "center", direction: "rtl", marginTop: "20px" }}>
                        <Spinner w={48} h={48} />
                        <div style={{ marginTop: "20px" }}>
                            <strong>{amount} تومان</strong>
                            <br />
                            به کارت {fullCard}
                        </div>
                    </div>
                ),
                hasCloseButton: false,
                fixedWidth: true,
            },
            "mx_CardToCardCard_progressDialog",
        );

        progressDialogRef.current = progressDialog;

        // After 3 seconds, show success
        setTimeout(() => {
            progressDialog.close();
            setIsSubmitting(false);

            Modal.createDialog(InfoDialog, {
                title: "تراکنش با موفقیت انجام شد!",
                description: (
                    <div style={{ textAlign: "center", direction: "rtl", marginTop: "20px" }}>
                        <div className="mx_CardToCardCard_checkmark" style={{ marginBottom: "20px" }}>
                            <CheckCircleIcon width="80px" height="80px" style={{ color: "#326430" }} />
                        </div>
                        <div style={{ textAlign: "right", direction: "rtl", lineHeight: "2" }}>
                            <p>
                                <strong>مبلغ:</strong> {amount} تومان
                            </p>
                            <p>
                                <strong>کارت مقصد:</strong> {fullCard}
                            </p>
                            <p>
                                <strong>شماره پیگیری:</strong> ۱۲۸۴۹۰۱۲۳
                            </p>
                        </div>
                    </div>
                ),
                hasCloseButton: true,
                fixedWidth: true,
            });
        }, 3000);
    };

    return (
        <div className="mx_CardToCardCard">
            <div className="mx_CardToCardCard_container">
                <div className="mx_CardToCardCard_header">
                    <div className="mx_CardToCardCard_headerContent">
                        <h1>کارت به کارت</h1>
                        <p>انتقال وجه سریع و امن</p>
                    </div>
                    <IconButton
                        size="28px"
                        onClick={onClose}
                        tooltip="بستن"
                        kind="secondary"
                        className="mx_CardToCardCard_closeBtn"
                    >
                        <CloseIcon />
                    </IconButton>
                </div>

                <div className="mx_CardToCardCard_formBody">
                    <form id="cardForm" onSubmit={handleSubmit}>
                        <div className="mx_CardToCardCard_inputGroup">
                            <label>شماره کارت مقصد</label>
                            <div className="mx_CardToCardCard_cardInputs">
                                <input
                                    ref={card1Ref}
                                    type="text"
                                    value={card1}
                                    onChange={(e) => handleCardInput(e.target.value, setCard1, 4)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && card1 === "") {
                                            e.preventDefault();
                                        }
                                    }}
                                    maxLength={4}
                                    inputMode="numeric"
                                    autoFocus
                                />
                                <input
                                    ref={card2Ref}
                                    type="text"
                                    value={card2}
                                    onChange={(e) => handleCardInput(e.target.value, setCard2, 4)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && card2 === "") {
                                            card1Ref.current?.focus();
                                        }
                                    }}
                                    maxLength={4}
                                    inputMode="numeric"
                                />
                                <input
                                    ref={card3Ref}
                                    type="text"
                                    value={card3}
                                    onChange={(e) => handleCardInput(e.target.value, setCard3, 4)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && card3 === "") {
                                            card2Ref.current?.focus();
                                        }
                                    }}
                                    maxLength={4}
                                    inputMode="numeric"
                                />
                                <input
                                    ref={card4Ref}
                                    type="text"
                                    value={card4}
                                    onChange={(e) => handleCardInput(e.target.value, setCard4, 4)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && card4 === "") {
                                            card3Ref.current?.focus();
                                        }
                                    }}
                                    maxLength={4}
                                    inputMode="numeric"
                                />
                            </div>
                        </div>

                        <div className="mx_CardToCardCard_inputGroup">
                            <label>مبلغ انتقال</label>
                            <div className="mx_CardToCardCard_amountWrapper">
                                <span className="mx_CardToCardCard_tomanLabel">تومان</span>
                                <input
                                    type="text"
                                    id="amount"
                                    value={amount}
                                    onChange={handleAmountInput}
                                    inputMode="numeric"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mx_CardToCardCard_inputGroup">
                            <label>توضیحات (اختیاری)</label>
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="mx_CardToCardCard_row">
                            <div className="mx_CardToCardCard_inputGroup">
                                <label>ماه انقضا</label>
                                <input
                                    ref={expMonthRef}
                                    type="text"
                                    value={expMonth}
                                    onChange={(e) => handleCardInput(e.target.value, setExpMonth, 2)}
                                    maxLength={2}
                                    inputMode="numeric"
                                />
                            </div>
                            <div className="mx_CardToCardCard_inputGroup">
                                <label>سال انقضا</label>
                                <input
                                    ref={expYearRef}
                                    type="text"
                                    value={expYear}
                                    onChange={(e) => handleCardInput(e.target.value, setExpYear, 2)}
                                    maxLength={2}
                                    inputMode="numeric"
                                />
                            </div>
                            <div className="mx_CardToCardCard_inputGroup">
                                <label>CVV2</label>
                                <input
                                    ref={cvv2Ref}
                                    type="text"
                                    value={cvv2}
                                    onChange={(e) => handleCardInput(e.target.value, setCvv2, 4)}
                                    maxLength={4}
                                    inputMode="numeric"
                                />
                            </div>
                        </div>

                        <div className="mx_CardToCardCard_inputGroup">
                            <label>رمز پویا</label>
                            <div className="mx_CardToCardCard_otpGroup">
                                <input
                                    ref={otpRef}
                                    type="text"
                                    id="otpInput"
                                    value={otp}
                                    onChange={(e) => handleCardInput(e.target.value, setOtp, 6)}
                                    maxLength={6}
                                    inputMode="numeric"
                                    style={{ letterSpacing: "10px", fontSize: "22px", fontWeight: "bold" }}
                                />
                                <button
                                    type="button"
                                    className="mx_CardToCardCard_getOtpBtn"
                                    onClick={handleGetOtp}
                                    disabled={isOtpDisabled}
                                >
                                    {isOtpDisabled ? `${otpTimer}s` : "دریافت رمز"}
                                </button>
                            </div>
                            {otpTimer > 0 && (
                                <div className="mx_CardToCardCard_timer">
                                    ارسال مجدد پس از {otpTimer} ثانیه
                                </div>
                            )}
                        </div>

                        <button type="submit" className="mx_CardToCardCard_btnPrimary" disabled={isSubmitting}>
                            {isSubmitting ? "در حال انتقال..." : "انتقال وجه"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CardToCardCard;


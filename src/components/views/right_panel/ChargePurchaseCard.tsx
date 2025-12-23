/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { useEffect, useRef, useState } from "react";
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

const ChargePurchaseCard: React.FC<Props> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [card1, setCard1] = useState("");
    const [card2, setCard2] = useState("");
    const [card3, setCard3] = useState("");
    const [card4, setCard4] = useState("");
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
    const phoneRef = useRef<HTMLInputElement>(null);

    // Auto-focus phone input on mount
    useEffect(() => {
        phoneRef.current?.focus();
    }, []);

    // Auto-focus first card input when step 2 is shown
    useEffect(() => {
        if (step === 2) {
            card1Ref.current?.focus();
        }
    }, [step]);

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

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numeric = forceNumeric(e.target.value);
        if (numeric.length <= 11) {
            setPhone(numeric);
        }
    };

    const handleAmountClick = (amount: number) => {
        setSelectedAmount(amount);
    };

    const handleNextStep = () => {
        if (!phone || phone.length !== 11 || !selectedAmount) {
            Modal.createDialog(ErrorDialog, {
                title: "خطا",
                description: "لطفاً شماره و مبلغ را انتخاب کنید",
            });
            return;
        }
        setStep(2);
    };

    const handlePrevStep = () => {
        setStep(1);
    };

    const handleGetOtp = () => {
        if (isOtpDisabled) return;

        Modal.createDialog(InfoDialog, {
            title: "رمز پویا ارسال شد!",
            description: "رمز به شماره شما پیامک شد",
            hasCloseButton: true,
        });

        // Fill OTP for testing
        setOtp("483920");

        // Disable button and start timer
        setIsOtpDisabled(true);
        setOtpTimer(60);
    };

    const handlePay = () => {
        const fullCard = `${card1.padStart(4, "0")}-${card2.padStart(4, "0")}-${card3.padStart(4, "0")}-${card4.padStart(4, "0")}`;
        const cardNumber = fullCard.replace(/-/g, "");

        if (cardNumber.length !== 16) {
            Modal.createDialog(ErrorDialog, {
                title: "خطا",
                description: "شماره کارت کامل نیست",
            });
            return;
        }

        setIsSubmitting(true);

        // Show progress dialog
        const progressDialog = Modal.createDialog(
            InfoDialog,
            {
                title: "در حال خرید شارژ...",
                description: (
                    <div style={{ textAlign: "center", direction: "rtl", marginTop: "20px" }}>
                        <Spinner w={48} h={48} />
                        <div style={{ marginTop: "20px" }}>
                            <strong>{selectedAmount?.toLocaleString("fa-IR")} تومان</strong>
                            <br />
                            برای {phone}
                        </div>
                    </div>
                ),
                hasCloseButton: false,
                fixedWidth: true,
            },
            "mx_ChargePurchaseCard_progressDialog",
        );

        progressDialogRef.current = progressDialog;

        // After 2.8 seconds, show success
        setTimeout(() => {
            progressDialog.close();
            setIsSubmitting(false);

            Modal.createDialog(InfoDialog, {
                title: "شارژ با موفقیت خریداری شد!",
                description: (
                    <div style={{ textAlign: "right", direction: "rtl", lineHeight: "2" }}>
                        <div className="mx_ChargePurchaseCard_checkmark" style={{ marginBottom: "20px", textAlign: "center" }}>
                            <CheckCircleIcon width="80px" height="80px" style={{ color: "#326430" }} />
                        </div>
                        <p>
                            <strong>مبلغ:</strong> {selectedAmount?.toLocaleString("fa-IR")} تومان
                        </p>
                        <p>
                            <strong>شماره:</strong> {phone}
                        </p>
                        <p>
                            <strong>شماره پیگیری:</strong> ۹۸۷۶۵۴۳۲۱
                        </p>
                    </div>
                ),
                hasCloseButton: true,
                fixedWidth: true,
            });
        }, 2800);
    };

    const amountButtons = [
        { amount: 10000, label: "۱۰,۰۰۰ تومان" },
        { amount: 20000, label: "۲۰,۰۰۰ تومان" },
        { amount: 30000, label: "۳۰,۰۰۰ تومان" },
        { amount: 40000, label: "۴۰,۰۰۰ تومان" },
        { amount: 50000, label: "۵۰,۰۰۰ تومان" },
    ];

    return (
        <div className="mx_ChargePurchaseCard" style={{ height: "95%" }}>
            <div className="mx_ChargePurchaseCard_container">
                <div className="mx_ChargePurchaseCard_header">
                    <div className="mx_ChargePurchaseCard_headerContent">
                        <h1>خرید شارژ</h1>
                        <p>شارژ ایرانسل، همراه اول، رایتل</p>
                    </div>
                    <IconButton
                        size="28px"
                        onClick={onClose}
                        tooltip="بستن"
                        kind="secondary"
                        className="mx_ChargePurchaseCard_closeBtn"
                    >
                        <CloseIcon />
                    </IconButton>
                </div>

                <div className="mx_ChargePurchaseCard_formBody">
                    {/* Step 1: Phone and Amount */}
                    {step === 1 && (
                        <div className="mx_ChargePurchaseCard_step" style={{ marginBottom: "100px" }}>
                            <div className="mx_ChargePurchaseCard_inputGroup">
                                <label>شماره موبایل</label>
                                <input
                                    ref={phoneRef}
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={handlePhoneInput}
                                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                                    maxLength={11}
                                    inputMode="numeric"
                                />
                            </div>

                            <div className="mx_ChargePurchaseCard_inputGroup">
                                <label>مبلغ شارژ</label>
                                <div className="mx_ChargePurchaseCard_amountButtons">
                                    {amountButtons.map((btn) => (
                                        <div
                                            key={btn.amount}
                                            className={`mx_ChargePurchaseCard_amountBtn ${selectedAmount === btn.amount ? "selected" : ""
                                                }`}
                                            onClick={() => handleAmountClick(btn.amount)}
                                        >
                                            {btn.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="mx_ChargePurchaseCard_btnPrimary"
                                onClick={handleNextStep}
                            >
                                مرحله بعد
                            </button>
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && (
                        <div className="mx_ChargePurchaseCard_step">
                            <div className="mx_ChargePurchaseCard_summary">
                                خرید شارژ <strong>{selectedAmount?.toLocaleString("fa-IR")} تومان</strong> برای شماره{" "}
                                <strong>{phone}</strong>
                            </div>

                            <div className="mx_ChargePurchaseCard_inputGroup">
                                <label>شماره کارت</label>
                                <div className="mx_ChargePurchaseCard_cardInputs">
                                    <input
                                        ref={card1Ref}
                                        type="text"
                                        id="card1"
                                        value={card1}
                                        onChange={(e) => handleCardInput(e.target.value, setCard1, 4)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Backspace" && card1 === "") {
                                                e.preventDefault();
                                            }
                                        }}
                                        maxLength={4}
                                        inputMode="numeric"
                                    />
                                    <input
                                        ref={card2Ref}
                                        type="text"
                                        id="card2"
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
                                        id="card3"
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
                                        id="card4"
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

                            <div className="mx_ChargePurchaseCard_row">
                                <div className="mx_ChargePurchaseCard_inputGroup">
                                    <label>ماه انقضا</label>
                                    <input
                                        ref={expMonthRef}
                                        type="text"
                                        id="expMonth"
                                        value={expMonth}
                                        onChange={(e) => handleCardInput(e.target.value, setExpMonth, 2)}
                                        placeholder="۰۶"
                                        maxLength={2}
                                        inputMode="numeric"
                                    />
                                </div>
                                <div className="mx_ChargePurchaseCard_inputGroup">
                                    <label>سال انقضا</label>
                                    <input
                                        ref={expYearRef}
                                        type="text"
                                        id="expYear"
                                        value={expYear}
                                        onChange={(e) => handleCardInput(e.target.value, setExpYear, 2)}
                                        placeholder="۰۵"
                                        maxLength={2}
                                        inputMode="numeric"
                                    />
                                </div>
                                <div className="mx_ChargePurchaseCard_inputGroup">
                                    <label>CVV2</label>
                                    <input
                                        ref={cvv2Ref}
                                        type="text"
                                        id="cvv2"
                                        value={cvv2}
                                        onChange={(e) => handleCardInput(e.target.value, setCvv2, 4)}
                                        placeholder="۱۲۳"
                                        maxLength={4}
                                        inputMode="numeric"
                                    />
                                </div>
                            </div>

                            <div className="mx_ChargePurchaseCard_inputGroup">
                                <label>رمز پویا</label>
                                <div className="mx_ChargePurchaseCard_otpGroup">
                                    <input
                                        ref={otpRef}
                                        type="text"
                                        id="otpInput"
                                        value={otp}
                                        onChange={(e) => handleCardInput(e.target.value, setOtp, 6)}
                                        placeholder="------"
                                        maxLength={6}
                                        inputMode="numeric"
                                    />
                                    <button
                                        type="button"
                                        className="mx_ChargePurchaseCard_getOtpBtn"
                                        onClick={handleGetOtp}
                                        disabled={isOtpDisabled}
                                    >
                                        {isOtpDisabled ? `${otpTimer}s` : "دریافت رمز"}
                                    </button>
                                </div>
                                {otpTimer > 0 && (
                                    <div className="mx_ChargePurchaseCard_timer">
                                        ارسال مجدد پس از {otpTimer} ثانیه
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                className="mx_ChargePurchaseCard_btnPrimary"
                                onClick={handlePay}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "در حال خرید شارژ..." : "پرداخت شارژ"}
                            </button>

                            <button type="button" className="mx_ChargePurchaseCard_btnSecondary" onClick={handlePrevStep}>
                                مرحله قبل
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChargePurchaseCard;



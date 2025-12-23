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

const BillPaymentCard: React.FC<Props> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [billType, setBillType] = useState("برق");
    const [billId, setBillId] = useState("");
    const [paymentId, setPaymentId] = useState("");
    const [finalAmount, setFinalAmount] = useState<number | null>(null);
    const [isBillChecked, setIsBillChecked] = useState(false);
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
    const billIdRef = useRef<HTMLInputElement>(null);

    // Auto-focus billId input on mount
    useEffect(() => {
        billIdRef.current?.focus();
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

    const handleBillTypeClick = (type: string) => {
        if (billType === type) return;
        setBillType(type);
        setIsBillChecked(false);
        setFinalAmount(null);
    };

    const handleCheckBill = () => {
        if (!billId || billId.length < 8) {
            Modal.createDialog(ErrorDialog, {
                title: "خطا",
                description: "شناسه قبض معتبر نیست",
            });
            return;
        }

        const amounts: Record<string, number> = {
            برق: 185000,
            آب: 92000,
            گاز: 274000,
            تلفن: 45000,
        };

        const amount = amounts[billType] || 120000;
        setFinalAmount(amount);
        setIsBillChecked(true);
    };

    const handleNextStep = () => {
        if (!isBillChecked || !finalAmount) {
            Modal.createDialog(ErrorDialog, {
                title: "خطا",
                description: "لطفاً ابتدا استعلام قبض را انجام دهید",
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
                title: "در حال پرداخت قبض...",
                description: (
                    <div style={{ textAlign: "center", direction: "rtl", marginTop: "20px" }}>
                        <Spinner w={48} h={48} />
                        <div style={{ marginTop: "20px" }}>
                            <strong>{finalAmount?.toLocaleString("fa-IR")} تومان</strong>
                            <br />
                            قبض {billType}
                        </div>
                    </div>
                ),
                hasCloseButton: false,
                fixedWidth: true,
            },
            "mx_BillPaymentCard_progressDialog",
        );

        progressDialogRef.current = progressDialog;

        // After 2.8 seconds, show success
        setTimeout(() => {
            progressDialog.close();
            setIsSubmitting(false);

            Modal.createDialog(InfoDialog, {
                title: "قبض با موفقیت پرداخت شد!",
                description: (
                    <div style={{ textAlign: "right", direction: "rtl", lineHeight: "2" }}>
                        <div className="mx_BillPaymentCard_checkmark" style={{ marginBottom: "20px", textAlign: "center" }}>
                            <CheckCircleIcon width="80px" height="80px" style={{ color: "#326430" }} />
                        </div>
                        <p>
                            <strong>نوع قبض:</strong> {billType}
                        </p>
                        <p>
                            <strong>شناسه قبض:</strong> {billId}
                        </p>
                        <p>
                            <strong>مبلغ:</strong> {finalAmount?.toLocaleString("fa-IR")} تومان
                        </p>
                        <p>
                            <strong>شماره پیگیری:</strong> ۸۷۶۵۴۳۲۱۰
                        </p>
                    </div>
                ),
                hasCloseButton: true,
                fixedWidth: true,
            });
        }, 2800);
    };

    const billTypes = ["برق", "آب", "گاز", "تلفن ثابت"];

    return (
        <div className="mx_BillPaymentCard" style={{ height: "100%" }}>
            <div className="mx_BillPaymentCard_container">
                <div className="mx_BillPaymentCard_header">
                    <div className="mx_BillPaymentCard_headerContent">
                        <h1>پرداخت قبض</h1>
                        <p>آب، برق، گاز، تلفن و ...</p>
                    </div>
                    <IconButton
                        size="28px"
                        onClick={onClose}
                        tooltip="بستن"
                        kind="secondary"
                        className="mx_BillPaymentCard_closeBtn"
                    >
                        <CloseIcon />
                    </IconButton>
                </div>

                <div className="mx_BillPaymentCard_formBody">
                    {/* Step 1: Bill Info */}
                    {step === 1 && (
                        <div className="mx_BillPaymentCard_step">
                            <div className="mx_BillPaymentCard_inputGroup">
                                <label>نوع قبض</label>
                                <div className="mx_BillPaymentCard_billTypes">
                                    {billTypes.map((type) => (
                                        <div
                                            key={type}
                                            className={`mx_BillPaymentCard_billType ${billType === type ? "selected" : ""}`}
                                            onClick={() => handleBillTypeClick(type)}
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mx_BillPaymentCard_inputGroup">
                                <label>شناسه قبض</label>
                                <input
                                    ref={billIdRef}
                                    type="text"
                                    id="billId"
                                    value={billId}
                                    onChange={(e) => {
                                        const numeric = forceNumeric(e.target.value);
                                        setBillId(numeric);
                                    }}
                                    placeholder="مثلاً ۱۲۳۴۵۶۷۸۹۰۱۲"
                                    inputMode="numeric"
                                />
                            </div>

                            <div className="mx_BillPaymentCard_inputGroup">
                                <label>شناسه پرداخت (اختیاری)</label>
                                <input
                                    type="text"
                                    id="paymentId"
                                    value={paymentId}
                                    onChange={(e) => {
                                        const numeric = forceNumeric(e.target.value);
                                        setPaymentId(numeric);
                                    }}
                                    placeholder="در صورت نیاز وارد کنید"
                                    inputMode="numeric"
                                />
                            </div>

                            {finalAmount !== null && (
                                <div className="mx_BillPaymentCard_billResult">
                                    مبلغ قابل پرداخت: <span>{finalAmount.toLocaleString("fa-IR")}</span> تومان
                                </div>
                            )}

                            {!isBillChecked ? (
                                <button
                                    type="button"
                                    className="mx_BillPaymentCard_btnPrimary"
                                    onClick={handleCheckBill}
                                >
                                    استعلام قبض
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="mx_BillPaymentCard_btnPrimary"
                                    onClick={handleNextStep}
                                >
                                    مرحله بعد
                                </button>
                            )}
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && (
                        <div className="mx_BillPaymentCard_step">
                            <div className="mx_BillPaymentCard_summary">
                                پرداخت قبض <strong>{billType}</strong>
                                <br />
                                شناسه قبض: <strong>{billId}</strong>
                                <br />
                                مبلغ: <strong>{finalAmount?.toLocaleString("fa-IR")} تومان</strong>
                            </div>

                            <div className="mx_BillPaymentCard_inputGroup">
                                <label>شماره کارت</label>
                                <div className="mx_BillPaymentCard_cardInputs">
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

                            <div className="mx_BillPaymentCard_row">
                                <div className="mx_BillPaymentCard_inputGroup">
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
                                <div className="mx_BillPaymentCard_inputGroup">
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
                                <div className="mx_BillPaymentCard_inputGroup">
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

                            <div className="mx_BillPaymentCard_inputGroup">
                                <label>رمز پویا</label>
                                <div className="mx_BillPaymentCard_otpGroup">
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
                                        className="mx_BillPaymentCard_getOtpBtn"
                                        onClick={handleGetOtp}
                                        disabled={isOtpDisabled}
                                    >
                                        {isOtpDisabled ? `${otpTimer}s` : "دریافت رمز"}
                                    </button>
                                </div>
                                {otpTimer > 0 && (
                                    <div className="mx_BillPaymentCard_timer">
                                        ارسال مجدد پس از {otpTimer} ثانیه
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                className="mx_BillPaymentCard_btnPrimary"
                                onClick={handlePay}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "در حال پرداخت قبض..." : "پرداخت قبض"}
                            </button>

                            <button type="button" className="mx_BillPaymentCard_btnSecondary" onClick={handlePrevStep}>
                                مرحله قبل
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillPaymentCard;


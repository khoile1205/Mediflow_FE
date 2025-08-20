import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qrcode-logo";
import { useReactToPrint } from "react-to-print";
import AppLogo from "~/assets/images/logo.png";
import { Dialog } from "~/components/common/dialog";
import i18n from "~/configs/i18n";
import { QRPrinter } from "./qr-printer";
import { useQueryCheckPaymentStatus } from "~/services/hospital-fee/hooks/queries";
import { PaymentStatus } from "~/constants/enums";

interface ReceiptQRCodePaymentProps {
    qrCode: string;
    paymentId: number;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onRegenerate: () => void;
}

const ReceiptQRCodePayment: React.FC<ReceiptQRCodePaymentProps> = ({
    qrCode,
    paymentId,
    open,
    onClose,
    onSuccess,
    onRegenerate,
}) => {
    const { t } = useTranslation();
    const qrRef = React.useRef<HTMLDivElement>(null);

    const [expired, setExpired] = React.useState(false);

    const handlePrint = useReactToPrint({
        contentRef: qrRef,
    });

    // ⏱ start 120s countdown when modal opens
    React.useEffect(() => {
        if (!open) return;
        setExpired(false);

        const timer = setTimeout(() => {
            setExpired(true);
        }, 120_000); // 120s

        return () => clearTimeout(timer);
    }, [open, paymentId]);

    const { data } = useQueryCheckPaymentStatus({ paymentId });

    React.useEffect(() => {
        if (data == PaymentStatus.COMPLETED) {
            onSuccess();
        }
    }, [data]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={false}
            sx={{
                "& .MuiPaper-root": {
                    minWidth: "18%",
                    minHeight: "18%",
                },
            }}
        >
            <Dialog.Body>
                <Box className="mt-3">
                    <Typography variant="h6" align="center">
                        {t(i18n.translationKey.paymentQRCode)}
                    </Typography>
                    <Box
                        sx={{
                            position: "relative",
                            display: "inline-block",
                            width: "100%",
                            mt: 2,
                        }}
                    >
                        <QRCode
                            removeQrCodeBehindLogo
                            value={qrCode}
                            style={{
                                width: "100%",
                                height: "100%",
                                filter: expired ? "blur(6px)" : "none", // ✅ blur when expired
                                cursor: expired ? "pointer" : "default",
                            }}
                            logoImage={AppLogo}
                            qrStyle="dots"
                            eyeRadius={5}
                        />

                        {expired && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    bgcolor: "rgba(0,0,0,0.6)",
                                    color: "white",
                                    p: 1.5,
                                    borderRadius: 2,
                                }}
                                onClick={() => {
                                    if (expired) {
                                        onRegenerate(); // ✅ regenerate QR when expired and clicked
                                    }
                                }}
                            >
                                <Typography variant="body2">{t(i18n.translationKey.expiredQrCode)}</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Dialog.Body>
            <Dialog.Action>
                <Button disabled={!qrCode || expired} onClick={handlePrint}>
                    {t(i18n.translationKey.printQr)}
                </Button>
            </Dialog.Action>

            <Box sx={{ display: "none" }}>
                <QRPrinter ref={qrRef} qrCode={qrCode} />
            </Box>
        </Dialog>
    );
};

export default ReceiptQRCodePayment;

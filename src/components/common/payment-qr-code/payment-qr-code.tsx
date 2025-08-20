import React from "react";
import { QRCode } from "react-qrcode-logo";
import AppLogo from "~/assets/images/logo.png";
import { Dialog } from "../dialog";
import { Box, Typography } from "@mui/material";

interface PaymentQRCodeProps {
    qrCode: string;
    open: boolean;
    onClose: () => void;
}

const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({ qrCode, open, onClose }) => {
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
                        Thanh toán QR Code
                    </Typography>
                    <QRCode
                        removeQrCodeBehindLogo
                        value={qrCode}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        logoImage={AppLogo}
                        qrStyle="squares"
                        eyeRadius={5}
                    />
                </Box>
            </Dialog.Body>
        </Dialog>
    );
};

export default PaymentQRCode;

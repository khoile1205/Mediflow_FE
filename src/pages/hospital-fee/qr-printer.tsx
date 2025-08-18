import { Box } from "@mui/material";
import React from "react";
import QRCode from "react-qrcode-logo";
import AppLogo from "~/assets/images/logo.png";

interface QRPrinterProps {
    qrCode: string;
}

export const QRPrinter = React.forwardRef<HTMLDivElement, QRPrinterProps>(({ qrCode }, ref) => {
    return (
        <Box ref={ref} sx={{ padding: 2, height: "100%", width: "100%" }}>
            <Box display="flex" justifyContent="center" mb={2}>
                <QRCode
                    removeQrCodeBehindLogo
                    value={qrCode}
                    size={250}
                    logoImage={AppLogo}
                    qrStyle="dots"
                    eyeRadius={5}
                />
            </Box>
        </Box>
    );
});

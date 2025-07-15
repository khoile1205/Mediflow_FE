import { Close } from "@mui/icons-material";
import { DialogTitle, IconButton, Typography } from "@mui/material";

interface Props {
    title: string;
    border?: boolean;
    onClose?: () => void;
}

const DialogHeader: React.FC<Props> = ({ border = true, title, onClose, ...props }) => {
    return (
        <DialogTitle
            className="flex items-center justify-between"
            style={{
                borderBottom: border ? `1px solid #E0E0E0` : `none`,
            }}
            flex={1}
            {...props}
        >
            <Typography className="text-lg font-semibold">{title}</Typography>
            {onClose && (
                <IconButton>
                    <Close onClick={onClose} />
                </IconButton>
            )}
        </DialogTitle>
    );
};

export default DialogHeader;
export type { Props as DialogHeaderType };

import { DialogActions } from "@mui/material";

interface Props {
    children: React.ReactNode;
    className?: string;
}

const DialogAction: React.FC<Props> = ({ children, className }) => {
    return <DialogActions className={className}>{children}</DialogActions>;
};

export default DialogAction;
export type { Props as DialogActionType };

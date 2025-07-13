import { DialogProps, Dialog as MUIDialog } from "@mui/material";
import React from "react";
import DialogAction, { DialogActionType } from "./dialog-action";
import DialogBody, { DialogBodyType } from "./dialog-body";
import DialogHeader, { DialogHeaderType } from "./dialog-header";
import { useDisableBodyScroll } from "~/hooks";

export interface DialogComposition {
    Header: React.FC<DialogHeaderType>;
    Body: React.FC<DialogBodyType>;
    Action: React.FC<DialogActionType>;
}

const Dialog: React.FC<DialogProps> & DialogComposition = ({ children, ...props }) => {
    useDisableBodyScroll(props.open);

    return (
        <MUIDialog
            sx={{
                ".MuiDialog-paper": {
                    borderRadius: 2,
                },
            }}
            fullWidth
            {...props}
        >
            {children}
        </MUIDialog>
    );
};

Dialog.Header = DialogHeader;
Dialog.Body = DialogBody;
Dialog.Action = DialogAction;

export default Dialog;

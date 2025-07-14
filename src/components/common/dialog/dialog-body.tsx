import { DialogContent, DialogContentProps } from "@mui/material";
import classNames from "classnames";

interface Props extends DialogContentProps {
    children: React.ReactNode;
}

const DialogBody: React.FC<Props> = ({ children, ...props }) => {
    return (
        <DialogContent {...props} className={classNames(props.className, "no-scrollbar")}>
            {children}
        </DialogContent>
    );
};

export default DialogBody;
export type { Props as DialogBodyType };

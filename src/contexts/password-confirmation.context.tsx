import React from "react";
import { ConfirmPasswordDialog } from "~/pages/management/medicine/ConfirmPasswordDialog";

interface PasswordConfirmContextType {
    isPasswordConfirmed: boolean;
    requestPasswordConfirmation: (onConfirmed: () => void) => void;
    resetPasswordConfirmationSession: () => void;
}

const PasswordConfirmContext = React.createContext<PasswordConfirmContextType | undefined>(undefined);

export const PasswordConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPasswordConfirmed, setIsPasswordConfirmed] = React.useState(false);
    const [onConfirmedCallback, setOnConfirmedCallback] = React.useState<() => void>(() => {});

    const requestPasswordConfirmation = React.useCallback(
        (onConfirmed: () => void) => {
            if (isPasswordConfirmed) {
                onConfirmed();
                return;
            }
            setOnConfirmedCallback(() => onConfirmed);
            setShowDialog(true);
        },
        [isPasswordConfirmed],
    );

    const resetPasswordConfirmationSession = () => {
        setIsPasswordConfirmed(false);
    };

    const handleConfirmed = () => {
        setIsPasswordConfirmed(true);
        setShowDialog(false);
        onConfirmedCallback();

        const expireAt = 30 * 60 * 1000; // 30 minutes
        setTimeout(() => {
            setIsPasswordConfirmed(false);
        }, expireAt);
    };

    const [showDialog, setShowDialog] = React.useState(false);

    return (
        <PasswordConfirmContext.Provider
            value={{ isPasswordConfirmed, requestPasswordConfirmation, resetPasswordConfirmationSession }}
        >
            {children}

            {/* Dialog rendering */}
            {showDialog && (
                <ConfirmPasswordDialog
                    open={showDialog}
                    onClose={() => setShowDialog(false)}
                    onConfirmed={handleConfirmed}
                />
            )}
        </PasswordConfirmContext.Provider>
    );
};

export const usePasswordConfirm = () => {
    const context = React.useContext(PasswordConfirmContext);
    if (!context) {
        throw new Error("usePasswordConfirm must be used within PasswordConfirmProvider");
    }
    return context;
};

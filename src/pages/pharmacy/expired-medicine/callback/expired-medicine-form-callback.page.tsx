import { CheckCircle, Error } from "@mui/icons-material";
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import React from "react";
import { useParams, useSearchParams } from "react-router";
import { useMutationApproveExpiredForm, useMutationRejectExpiredForm } from "~/services/inventory/hooks/mutations";

const ExpiredMedicineCallbackPage: React.FC = () => {
    const { id, action } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const approveMutation = useMutationApproveExpiredForm();
    const rejectMutation = useMutationRejectExpiredForm();

    const isValidAction = action === "approval" || action === "reject";

    const handleCallback = async () => {
        if (action === "approval") {
            await approveMutation.mutateAsync({ id: Number(id), token });
        } else if (action === "reject") {
            await rejectMutation.mutateAsync({ id: Number(id), token });
        }
    };

    React.useEffect(() => {
        handleCallback();
    }, [id, action, token]);

    const isLoading = approveMutation.isPending || rejectMutation.isPending;
    const isSuccess = approveMutation.isSuccess || rejectMutation.isSuccess;
    const isError = approveMutation.isError || rejectMutation.isError;
    const error = approveMutation.error || rejectMutation.error;

    if (!id || !token || !isValidAction) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Error color="error" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h5" color="error" gutterBottom>
                        Invalid Callback
                    </Typography>
                    <Typography color="text.secondary">
                        {!id || !token ? "Missing required parameters." : "Invalid action type."}
                    </Typography>
                </Paper>
            </Box>
        );
    }
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper sx={{ p: 4, textAlign: "center", width: 400 }}>
                {isLoading && (
                    <>
                        <CircularProgress size={60} sx={{ mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Processing Request
                        </Typography>
                        <Typography color="text.secondary">
                            Please wait while we process the {action} request for expired medicine.
                        </Typography>
                    </>
                )}

                {isSuccess && (
                    <>
                        <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h5" color="success.main" gutterBottom>
                            {action === "approval" ? "Form Approved" : "Form Rejected"}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                            The expired medicine return form (ID: {id}) was successfully{" "}
                            {action === "approval" ? "approved" : "rejected"}.
                        </Typography>
                        <Button variant="contained" sx={{ mt: 3 }} onClick={() => window.close()}>
                            Close
                        </Button>
                    </>
                )}

                {isError && (
                    <>
                        <Error color="error" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h5" color="error" gutterBottom>
                            Failed to Process
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                            {(error as Error)?.message || "Something went wrong while processing the request."}
                        </Typography>
                        <Button variant="outlined" sx={{ mt: 3 }} onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default ExpiredMedicineCallbackPage;

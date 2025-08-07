import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { useMutationAssignServicesToGroup } from "~/services/hospital-service/hooks/mutations/use-mutation-assign-services-to-group";
import { hospitalServiceApis } from "~/services/hospital-service/infras";
import { showToast } from "~/utils";

interface Props {
    open: boolean;
    groupId: number;
    services: { id: string; name: string; selected: boolean }[];
    onServiceToggle: (serviceId: string) => void;
    onSave: (groupId: string) => void;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormValues {
    serviceIds: string[];
}

export default function ModalAssignServicesToGroup({
    open,
    groupId,
    services,
    onServiceToggle,
    onSave,
    onClose,
    onSuccess,
}: Props) {
    const { t } = useTranslation();

    const form = useForm<FormValues>({
        defaultValues: {
            serviceIds: services.filter((s) => s.selected).map((s) => s.id),
        },
    });

    const { data } = useQuery({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_HOSPITAL_SERVICE_LIST],
        queryFn: () => hospitalServiceApis.getAllHospitalServices(),
        enabled: open,
    });

    const assignMutation = useMutationAssignServicesToGroup();

    const handleSubmit = () => {
        const { serviceIds } = form.getValues();

        if (!serviceIds || serviceIds.length === 0) {
            showToast.error(t(i18n.translationKey.noServiceSelected));
            return;
        }

        assignMutation.mutate(
            {
                serviceGroupId: groupId,
                serviceIds: serviceIds.map(Number),
            },
            {
                onSuccess: () => {
                    showToast.success(t(i18n.translationKey.assignServiceToGroupSuccess));
                    onSave(groupId.toString());
                    onClose();
                    onSuccess();
                },
                onError: () => {
                    showToast.error(t(i18n.translationKey.assignServiceToGroupFailed));
                },
            },
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t(i18n.translationKey.assignServiceToGroup)}</DialogTitle>
            <DialogContent dividers>
                <DynamicForm form={form}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <FormItem
                                render="checkbox-group"
                                name="serviceIds"
                                label={t(i18n.translationKey.selectServices)}
                                options={(data?.Data ?? []).map((service) => ({
                                    label: service.serviceName,
                                    value: service.id.toString(),
                                    checked: services.find((s) => s.id === service.id.toString())?.selected || false,
                                    onChange: () => onServiceToggle(service.id.toString()),
                                }))}
                            />
                        </Grid>
                    </Grid>
                </DynamicForm>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    {t(i18n.translationKey.cancel)}
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={assignMutation.isPending}>
                    {t(i18n.translationKey.save)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

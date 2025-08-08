import { Box, Button, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import i18n from "~/configs/i18n";
import { useMutationCreateMedicineInteraction } from "~/services/inventory/hooks/mutations/use-mutation-create-medicine-interaction";
import { CreateMedicineInteractionRequest } from "~/services/inventory/infras/types";
import { useQueryGetMedicines } from "~/services/inventory/hooks/queries/use-query-get-medicines";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import usePagination from "~/hooks/use-pagination";
import { showToast } from "~/utils";

export default function CreateMedicineInteractionPage() {
    const { t } = useTranslation();
    const form = useForm<CreateMedicineInteractionRequest>();
    const { pageIndex, pageSize } = usePagination();

    const { data: medicineData } = useQueryGetMedicines({
        isEnabled: true,
        query: { pageIndex, pageSize },
    });

    const { mutateAsync: createInteraction, isPending } = useMutationCreateMedicineInteraction();

    const onSubmit = async (data: CreateMedicineInteractionRequest) => {
        try {
            await createInteraction(data);
            showToast.success(t(i18n.translationKey.createMedicineInteractionSuccess));
            form.reset();
        } catch (_err) {
            showToast.error(t(i18n.translationKey.createMedicineInteractionFailed));
        }
    };

    const medicineOptions =
        medicineData?.medicines?.map((medicine) => ({
            label: medicine.medicineName,
            value: medicine.id,
        })) ?? [];

    return (
        <Box p={3}>
            <DynamicForm form={form} onSubmit={onSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="select"
                            name="medicineId1"
                            label={t(i18n.translationKey.medicine1)}
                            options={medicineOptions}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="select"
                            name="medicineId2"
                            label={t(i18n.translationKey.medicine2)}
                            options={medicineOptions}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="text-area"
                            name="harmfulEffects"
                            label={t(i18n.translationKey.harmfulEffects)}
                            multiline
                            minRows={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="text-area"
                            name="mechanism"
                            label={t(i18n.translationKey.mechanism)}
                            multiline
                            minRows={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="text-area"
                            name="preventiveActions"
                            label={t(i18n.translationKey.preventiveActions)}
                            multiline
                            minRows={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="text-area"
                            name="referenceInfo"
                            label={t(i18n.translationKey.referenceInfo)}
                            multiline
                            minRows={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormItem
                            render="text-area"
                            name="notes"
                            label={t(i18n.translationKey.note)}
                            multiline
                            minRows={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Button type="button" fullWidth variant="outlined" startIcon={<CloseIcon />}>
                            {t(i18n.translationKey.cancel)}
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={isPending}
                        >
                            {t(i18n.translationKey.create)}
                        </Button>
                    </Grid>
                </Grid>
            </DynamicForm>
        </Box>
    );
}

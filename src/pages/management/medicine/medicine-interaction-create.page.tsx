import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import i18n from "~/configs/i18n";
import { useQueryGetMedicines } from "~/services/inventory/hooks/queries/use-query-get-medicines";
import { useMutationCreateMedicineInteraction } from "~/services/inventory/hooks/mutations/use-mutation-create-medicine-interaction";
import { CreateMedicineInteractionRequest } from "~/services/inventory/infras/types";
import { success, error } from "~/utils/showToast";

export default function CreateMedicineInteractionPage() {
    const { t } = useTranslation();
    const { control, handleSubmit, reset } = useForm<CreateMedicineInteractionRequest>();

    const { data: medicineData } = useQueryGetMedicines({
        isEnabled: true,
        query: { pageIndex: 1, pageSize: 1000 },
    });

    const { mutateAsync: createInteraction, isPending } = useMutationCreateMedicineInteraction();

    const onSubmit = async (data: CreateMedicineInteractionRequest) => {
        try {
            await createInteraction(data);
            success(t(i18n.translationKey.createMedicineInteractionSuccess));
            reset();
        } catch (_err) {
            error(t(i18n.translationKey.createMedicineInteractionFailed));
        }
    };

    return (
        <Box p={3}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="medicineId1"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} select fullWidth label={t(i18n.translationKey.medicine1)}>
                                    {medicineData.medicines.map((medicine) => (
                                        <MenuItem key={medicine.id} value={medicine.id}>
                                            {medicine.medicineName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="medicineId2"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} select fullWidth label={t(i18n.translationKey.medicine2)}>
                                    {medicineData.medicines.map((medicine) => (
                                        <MenuItem key={medicine.id} value={medicine.id}>
                                            {medicine.medicineName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="harmfulEffects"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    multiline
                                    fullWidth
                                    label={t(i18n.translationKey.harmfulEffects)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="mechanism"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} multiline fullWidth label={t(i18n.translationKey.mechanism)} />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="preventiveActions"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    multiline
                                    fullWidth
                                    label={t(i18n.translationKey.preventiveActions)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="referenceInfo"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    multiline
                                    fullWidth
                                    label={t(i18n.translationKey.referenceInfo)}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} multiline fullWidth label={t(i18n.translationKey.note)} />
                            )}
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
            </form>
        </Box>
    );
}

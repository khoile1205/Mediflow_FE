import { Box, Grid, TextField, Checkbox, FormControlLabel, Button, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";
import { useQueryCreateMedicine } from "~/services/inventory/hooks/mutations/use-mutation-create-medicine";
import { showToast } from "~/utils";
import i18n from "~/configs/i18n";
import { useQueryGetVaccineTypes } from "~/services/inventory/hooks/queries/use-query-get-vaccine-types";

interface MedicineFormValues {
    medicineCode: string;
    medicineName: string;
    registrationNumber: string;
    unit: string;
    activeIngredient: string;
    concentration: string;
    usageInstructions: string;
    indications: string;
    routeOfAdministration: string;
    vaccineTypeId: string;
    medicineClassification: string;
    nationalMedicineCode: string;
    description: string;
    note: string;
    requiresTestBeforeUse: boolean;
}

export default function CreateMedicinePage() {
    const { control, handleSubmit } = useForm<MedicineFormValues>({
        defaultValues: {
            requiresTestBeforeUse: false,
        },
    });

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutate: createMedicine } = useQueryCreateMedicine();

    const { data: vaccineTypes = [] } = useQueryGetVaccineTypes();

    const routes = [
        { id: 1, name: t(i18n.translationKey.routeAdminIM) },
        { id: 2, name: t(i18n.translationKey.routeAdminSC) },
        { id: 3, name: t(i18n.translationKey.routeAdminID) },
        { id: 4, name: t(i18n.translationKey.routeAdminPO) },
        { id: 5, name: t(i18n.translationKey.routeAdminIN) },
    ];

    const onSubmit = (formData: MedicineFormValues) => {
        const payload = {
            medicineCode: formData.medicineCode,
            medicineName: formData.medicineName,
            registrationNumber: formData.registrationNumber,
            unit: formData.unit,
            activeIngredient: formData.activeIngredient,
            usageInstructions: formData.usageInstructions,
            concentration: formData.concentration,
            indications: formData.indications,
            medicineClassification: formData.medicineClassification,
            routeOfAdministration: Number(formData.routeOfAdministration),
            nationalMedicineCode: formData.nationalMedicineCode,
            description: formData.description,
            note: formData.note,
            isRequiredTestingBeforeUse: formData.requiresTestBeforeUse ?? false,
            medicineTypeId: 1,
            vaccineTypeId: Number(formData.vaccineTypeId) || 0,
        };

        createMedicine(payload, {
            onSuccess: () => {
                showToast.success(t(i18n.translationKey.createMedicineSuccess));
                navigate("/pharmacy/medicine-list");
            },
            onError: () => {
                showToast.error(t(i18n.translationKey.createMedicineFailed));
            },
        });
    };

    return (
        <Box p={3}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={5}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="medicineCode"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label={t(i18n.translationKey.medicineCode)} />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="medicineName"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label={t(i18n.translationKey.medicineName)} />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="registrationNumber"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label={t(i18n.translationKey.registrationNumber)} />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <Controller
                            name="unit"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label={t(i18n.translationKey.unit)} />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Controller
                            name="activeIngredient"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label={t(i18n.translationKey.activeIngredient)} />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Controller
                            name="concentration"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label={t(i18n.translationKey.dosage)} />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }} display="flex" alignItems="center">
                        <Controller
                            name="requiresTestBeforeUse"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} checked={field.value} />}
                                    label={t(i18n.translationKey.requiresTestBeforeUse)}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="usageInstructions"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    multiline
                                    label={t(i18n.translationKey.usageInstructions)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="indications"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth multiline label={t(i18n.translationKey.indications)} />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="routeOfAdministration"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    label={t(i18n.translationKey.routeOfAdministration)}
                                >
                                    {routes.map((r) => (
                                        <MenuItem key={r.id} value={r.id}>
                                            {r.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="vaccineTypeId"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} select fullWidth label={t(i18n.translationKey.vaccineType)}>
                                    {vaccineTypes.map((v) => (
                                        <MenuItem key={v.vaccineTypeId} value={v.vaccineTypeId}>
                                            {v.vaccinatTypeName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="medicineClassification"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label={t(i18n.translationKey.classification)} />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="nationalMedicineCode"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label={t(i18n.translationKey.nationalMedicineCode)} />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth multiline label={t(i18n.translationKey.description)} />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="note"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth multiline label={t(i18n.translationKey.note)} />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Button
                            type="button"
                            fullWidth
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={() => navigate("/pharmacy/medicine-list")}
                        >
                            {t(i18n.translationKey.cancel)}
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Button type="submit" fullWidth variant="contained" startIcon={<SaveIcon />}>
                            {t(i18n.translationKey.create)}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

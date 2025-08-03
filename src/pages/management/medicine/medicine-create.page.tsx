import { Box, Button, Grid } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import i18n from "~/configs/i18n";
import { useQueryCreateMedicine } from "~/services/inventory/hooks/mutations/use-mutation-create-medicine";
import { useQueryGetVaccineTypes } from "~/services/inventory/hooks/queries/use-query-get-vaccine-types";
import { showToast } from "~/utils";
import FormItem from "~/components/form/form-item";
import DynamicForm from "~/components/form/dynamic-form";

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
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { mutate: createMedicine } = useQueryCreateMedicine();
    const { data: vaccineTypes = [] } = useQueryGetVaccineTypes();

    const routes = [
        { value: "1", label: t(i18n.translationKey.routeAdminIM) },
        { value: "2", label: t(i18n.translationKey.routeAdminSC) },
        { value: "3", label: t(i18n.translationKey.routeAdminID) },
    ];

    const form = useForm<MedicineFormValues>({
        defaultValues: {
            requiresTestBeforeUse: false,
            routeOfAdministration: "1",
            vaccineTypeId: "",
        },
    });

    const onSubmit = (data: MedicineFormValues) => {
        const payload = {
            medicineCode: data.medicineCode,
            medicineName: data.medicineName,
            registrationNumber: data.registrationNumber,
            unit: data.unit,
            activeIngredient: data.activeIngredient,
            usageInstructions: data.usageInstructions,
            concentration: data.concentration,
            indications: data.indications,
            medicineClassification: data.medicineClassification,
            routeOfAdministration: Number(data.routeOfAdministration),
            nationalMedicineCode: data.nationalMedicineCode,
            description: data.description,
            note: data.note,
            isRequiredTestingBeforeUse: data.requiresTestBeforeUse ?? false,
            medicineTypeId: 1,
            vaccineTypeId: Number(data.vaccineTypeId) || 0,
        };

        createMedicine(payload, {
            onSuccess: () => {
                showToast.success(t(i18n.translationKey.createMedicineSuccess));
                navigate("/medicine/medicine-list");
            },
            onError: () => {
                showToast.error(t(i18n.translationKey.createMedicineFailed));
            },
        });
    };

    return (
        <Box p={3}>
            <DynamicForm form={form} onSubmit={onSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormItem render="text-input" name="medicineCode" label={t(i18n.translationKey.medicineCode)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormItem render="text-input" name="medicineName" label={t(i18n.translationKey.medicineName)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormItem
                            render="text-input"
                            name="registrationNumber"
                            label={t(i18n.translationKey.registrationNumber)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormItem render="text-input" name="unit" label={t(i18n.translationKey.unit)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormItem
                            render="text-input"
                            name="activeIngredient"
                            label={t(i18n.translationKey.activeIngredient)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormItem render="text-input" name="concentration" label={t(i18n.translationKey.dosage)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }} display="flex" alignItems="center">
                        <FormItem
                            render="checkbox"
                            name="requiresTestBeforeUse"
                            label={t(i18n.translationKey.requiresTestBeforeUse)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormItem
                            render="text-area"
                            name="usageInstructions"
                            label={t(i18n.translationKey.usageInstructions)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormItem render="text-area" name="indications" label={t(i18n.translationKey.indications)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormItem
                            render="select"
                            name="routeOfAdministration"
                            label={t(i18n.translationKey.routeOfAdministration)}
                            options={routes}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormItem
                            render="select"
                            name="vaccineTypeId"
                            label={t(i18n.translationKey.vaccineType)}
                            options={vaccineTypes.map((v) => ({
                                label: v.vaccinatTypeName,
                                value: String(v.vaccineTypeId),
                            }))}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormItem
                            render="text-input"
                            name="medicineClassification"
                            label={t(i18n.translationKey.classification)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormItem
                            render="text-input"
                            name="nationalMedicineCode"
                            label={t(i18n.translationKey.nationalMedicineCode)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem render="text-area" name="description" label={t(i18n.translationKey.description)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem render="text-area" name="note" label={t(i18n.translationKey.note)} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Button
                            type="button"
                            fullWidth
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={() => navigate("/medicine/medicine-list")}
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
            </DynamicForm>
        </Box>
    );
}

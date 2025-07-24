import { KeyboardReturn, Save } from "@mui/icons-material";
import { Box, FormControl, FormLabel, Grid, SelectChangeEvent } from "@mui/material";
import React, { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import SearchBox from "~/components/common/search-box";
import DynamicForm from "~/components/form/dynamic-form";
import i18n from "~/configs/i18n";
import { useExaminationForm } from "./hooks";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import {
    Examination,
    ExaminationOfReception,
    ExaminationResult,
    PatientForExamination,
    SampleQuality,
    SampleType,
    ServiceTestParameter,
} from "~/entities";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import FormItem from "~/components/form/form-item";
import { useAuth } from "~/contexts/auth.context";
import {
    useQueriesPatientExaminationDetailByExaminationId,
    useQueriesServiceTestParametersOfExaminationByExaminationId,
    useQueryAllExaminationOfReceptionByReceptionId,
    useQueryGetAllExaminationTechnician,
    useQueryPatientsForExamination,
} from "~/services/examination/hooks/queries";
import { ExaminationFormValue } from "./types";
import { showToast } from "~/utils";
import { useMutationUpsertExaminationResult } from "~/services/examination/hooks/mutations";

export const ExaminationPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const examinationAgGrid = useAgGrid({});
    const examinationResultAgGrid = useAgGrid({});

    const [patientName, setPatientName] = React.useState<string>("");
    const [isDiagnosed] = React.useState<boolean>(false);
    const [selectedPatient, setSelectedPatient] = React.useState<PatientForExamination | null>(null);

    const {
        data: { patientsForExamination },
    } = useQueryPatientsForExamination(patientName, isDiagnosed);

    const {
        data: { examinationTechnicians },
    } = useQueryGetAllExaminationTechnician();

    const examinationColumnDefs = React.useMemo(
        () =>
            [
                { field: "patientCode", headerName: t(i18n.translationKey.medicalCode), cellClass: "ag-cell-center" },
                { field: "patientName", headerName: t(i18n.translationKey.patientName) },
                {
                    field: "yearOfBirth",
                    headerName: t(i18n.translationKey.yearOfBirth),
                    cellClass: "ag-cell-center",
                },
                {
                    headerName: t(isDiagnosed ? i18n.translationKey.detail : i18n.translationKey.call),
                    cellClass: "ag-cell-center",
                    cellRenderer: (params: ICellRendererParams<PatientForExamination>) => (
                        <>
                            <ActionButton
                                label={t(isDiagnosed ? i18n.translationKey.detail : i18n.translationKey.call)}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 4, px: 2, py: 0, height: "70%" }}
                                onClick={() => handleSelectPatient(params.data)}
                            />
                        </>
                    ),
                },
            ] as ColDef<PatientForExamination>[],
        [],
    );

    const {
        data: { examinationsOfReception },
    } = useQueryAllExaminationOfReceptionByReceptionId(selectedPatient?.receptionId ?? 0);

    const examinationResultColumnDefs = React.useMemo(
        () =>
            [
                { field: "requestNumber", headerName: t(i18n.translationKey.requestNumber) },
                { field: "parameterName", headerName: t(i18n.translationKey.serviceName) },
                {
                    field: "result",
                    headerName: t(i18n.translationKey.result),
                    headerStyle: {
                        textAlign: "center",
                        fontWeight: "bold",
                        backgroundColor: "#4f959d",
                        borderColor: "#4f959d",
                    },
                    cellStyle: {
                        borderColor: "#4f959d",
                    },
                    editable: true,
                },
                {
                    field: "standardValue",
                    headerName: t(i18n.translationKey.standardValue),
                    cellRenderer: (params: ICellRendererParams<ServiceTestParameter>) => (
                        <>
                            <span>
                                {params.data.standardValue} {params.data.unit}
                            </span>
                        </>
                    ),
                },
                {
                    field: "equipmentName",
                    headerName: t(i18n.translationKey.specimenDeviceType),
                    cellRenderer: (params: ICellRendererParams<ServiceTestParameter>) => (
                        <>
                            <span>
                                {params.data.specimenType} / {params.data.equipmentName}
                            </span>
                            yả
                        </>
                    ),
                },
            ] as ColDef<ServiceTestParameter>[],
        [],
    );

    const examinationIds = React.useMemo(() => {
        return examinationsOfReception?.map((item: ExaminationOfReception) => item.examinationId) ?? [];
    }, [examinationsOfReception]);

    const form = useExaminationForm();

    const handlePatientSearch = (value: string) => {
        setPatientName(value);
    };

    const handleSelectPatient = (selectedPatient: PatientForExamination) => {
        form.setValue("patientId", selectedPatient.patientId);
        setSelectedPatient(selectedPatient);

        form.setValue("doctorId", user.id);
    };

    const { data: examinationDetails } = useQueriesPatientExaminationDetailByExaminationId(examinationIds);

    const { data: serviceTestParameters } = useQueriesServiceTestParametersOfExaminationByExaminationId(examinationIds);

    const [examinationFormValueList, setExaminationFormValueList] = React.useState<ExaminationFormValue[]>([]);
    const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);

    useEffect(() => {
        const isExaminationReady = examinationDetails && examinationDetails.length > 0 && examinationDetails[0];
        const isParameterReady = serviceTestParameters && serviceTestParameters.length > 0 && serviceTestParameters[0];

        if (isExaminationReady && isParameterReady && selectedIndex === -1) {
            const defaultReturnTime = new Date();
            defaultReturnTime.setMinutes(defaultReturnTime.getMinutes() + 30);

            const formValues: ExaminationFormValue[] = examinationDetails.map((examination, index) => {
                return {
                    examinationId: examination.examinationId ?? examinationIds[index],
                    patientId: examination.patientId ?? selectedPatient?.patientId ?? null,
                    diagnose: examination.diagnose ?? "",
                    returnResultsAfter: "30",
                    returnTime: defaultReturnTime,
                    performTechnicianId: examination.performTechnicianId ?? examinationTechnicians?.[0]?.id ?? null,
                    sampleType: examination.sampleType ?? SampleType.BLOOD,
                    sampleQuality: examination.sampleQuality ?? SampleQuality.HIGH,
                    doctorId: examination.doctorId ?? user.id,
                    conclusion: examination.conclusion ?? "",
                    note: examination.note ?? "",
                    serviceTestParameters: serviceTestParameters[index] || [],
                };
            });

            setExaminationFormValueList(formValues);
            setSelectedIndex(0);
        }
    }, [examinationDetails, serviceTestParameters]);

    useEffect(() => {
        if (selectedIndex !== -1) {
            form.reset(examinationFormValueList[selectedIndex]);
        }
    }, [selectedIndex]);

    const handleSelectServiceGroup = (event: SelectChangeEvent<unknown>, _child: ReactNode): void => {
        const newIndex = event.target.value as number;

        // Save current form to list before switching
        const currentFormValue = form.getValues();
        setExaminationFormValueList((prev) => {
            const updated = [...prev];
            if (selectedIndex !== -1) {
                updated[selectedIndex] = { ...updated[selectedIndex], ...currentFormValue };
            }
            return updated;
        });

        // Switch to another form
        setSelectedIndex(newIndex);
    };

    const resetForm = () => {
        form.reset();
        form.setValue("serviceTestParameters", []);
        setSelectedPatient(null);
        setSelectedIndex(-1);
        setExaminationFormValueList([]);
        setPatientName("");
    };

    const handleCancel = () => {
        resetForm();
    };

    const checkIfFormIsValid = (data: ExaminationFormValue) => {
        if (
            data.examinationId === null ||
            data.performTechnicianId === null ||
            data.patientId === null ||
            data.doctorId === null
        ) {
            return false;
        }
        if (data.serviceTestParameters.length === 0) {
            return false;
        }
        if (data.diagnose.trim() === "" || data.conclusion.trim() === "") {
            return false;
        }
        if (data.returnTime <= new Date()) {
            return false;
        }
        if (data.sampleType === null || data.sampleQuality === null) {
            return false;
        }
        if (data.serviceTestParameters.some((param) => param.result.trim() === "")) {
            return false;
        }

        return true;
    };

    const { mutateAsync: saveExamination } = useMutationUpsertExaminationResult();

    const handleSaveExamination = async (data: ExaminationFormValue) => {
        let examinationFormList: ExaminationFormValue[] = [];
        setExaminationFormValueList((prev) => {
            const updated = [...prev];
            if (selectedIndex !== -1) {
                updated[selectedIndex] = { ...updated[selectedIndex], ...data };
            }

            examinationFormList = updated;
            return updated;
        });

        if (selectedIndex === -1) {
            showToast.error(t(i18n.translationKey.invalidExaminationData));
            return;
        }

        const examinationData: Examination[] = [];

        examinationFormList.forEach((formValue) => {
            const returnTime = new Date();
            returnTime.setMinutes(returnTime.getMinutes() + parseInt(formValue.returnResultsAfter));
            formValue.returnTime = returnTime;

            if (checkIfFormIsValid(formValue)) {
                const examinationResults: ExaminationResult[] = [];

                formValue.serviceTestParameters.forEach((param) => {
                    examinationResults.push({
                        parameterName: param.parameterName,
                        unit: param.unit,
                        resultValue: param.result,
                        standardValue: param.standardValue,
                    });
                });

                examinationData.push({
                    id: null,
                    examinationId: formValue.examinationId,
                    patientId: formValue.patientId,
                    diagnose: formValue.diagnose,
                    returnTime: formValue.returnTime,
                    performTechnicianId: formValue.performTechnicianId,
                    sampleType: formValue.sampleType,
                    sampleQuality: formValue.sampleQuality,
                    doctorId: formValue.doctorId,
                    conclusion: formValue.conclusion,
                    note: formValue.note,
                    examinationResults: examinationResults,
                    createdBy: user.id,
                    lastUpdatedBy: user.id,
                });
            }
        });

        if (examinationData.length === 0 || examinationData.length !== examinationFormList.length) {
            showToast.error(t(i18n.translationKey.invalidExaminationData));
            return;
        }

        await saveExamination(examinationData);
        resetForm();
    };

    return (
        <>
            <DynamicForm form={form}>
                <Grid container>
                    <Grid
                        size={4}
                        bgcolor={"warning.light"}
                        borderRadius={4}
                        padding={1}
                        sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    >
                        <Box marginBottom={2} border={2} borderColor={"primary.main"} borderRadius={4} padding={1}>
                            <SearchBox
                                onChange={handlePatientSearch}
                                placeholder={t(i18n.translationKey.untestedPatient)}
                            />
                            <AgDataGrid
                                columnDefs={examinationColumnDefs}
                                rowData={patientsForExamination}
                                maxRows={5}
                                cellSelection={false}
                                className="mt-2"
                                {...examinationAgGrid}
                            />
                        </Box>
                        <Grid spacing={2}>
                            <Grid container spacing={2}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <FormItem
                                        render="text-input"
                                        name=""
                                        label={t(i18n.translationKey.medicalCode)}
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                                value: selectedPatient?.patientCode ?? "",
                                            },
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <FormItem
                                        render="text-input"
                                        name=""
                                        label={t(i18n.translationKey.yearOld)}
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                                value: selectedPatient?.age ?? "",
                                            },
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <FormItem
                                render="text-input"
                                name=""
                                label={t(i18n.translationKey.fullName)}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                        value: selectedPatient?.patientName ?? "",
                                    },
                                }}
                            />
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name=""
                                        label={t(i18n.translationKey.gender)}
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                                value: selectedPatient?.gender ?? "",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name=""
                                        label={t(i18n.translationKey.yearOfBirth)}
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                                value: selectedPatient?.yearOfBirth ?? "",
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <FormItem
                                render="text-area"
                                name="diagnose"
                                label={t(i18n.translationKey.diagnose)}
                                rows={2}
                                required
                            />
                            <FormItem
                                render="select"
                                name="performTechnicianId"
                                label={t(i18n.translationKey.performTechnician)}
                                required
                                options={
                                    examinationTechnicians === null
                                        ? []
                                        : examinationTechnicians.map((item) => ({
                                              label: item.name,
                                              value: item.id,
                                          }))
                                }
                            />
                            <FormControl required fullWidth className="mb-2">
                                <FormLabel>{t(i18n.translationKey.returnResultsAfter)}</FormLabel>
                                <Grid spacing={2} textAlign={"right"}>
                                    <FormItem
                                        render="radio-group"
                                        name="returnResultsAfter"
                                        label={t(i18n.translationKey.returnResultsAfter)}
                                        options={[
                                            { label: t(i18n.translationKey.thirtyMinutes), value: "30" },
                                            { label: t(i18n.translationKey.sixtyMinutes), value: "60" },
                                            { label: t(i18n.translationKey.ninetyMinutes), value: "90" },
                                        ]}
                                        required
                                    />
                                </Grid>
                            </FormControl>
                            <FormItem
                                render="select"
                                name="sampleType"
                                label={t(i18n.translationKey.sampleType)}
                                required
                                options={[
                                    { label: t(i18n.translationKey.blood), value: SampleType.BLOOD },
                                    { label: t(i18n.translationKey.fluid), value: SampleType.FLUID },
                                    { label: t(i18n.translationKey.urine), value: SampleType.URINE },
                                    { label: t(i18n.translationKey.semen), value: SampleType.SEMEN },
                                    { label: t(i18n.translationKey.fluidUrine), value: SampleType.FLUID_URINE },
                                    { label: t(i18n.translationKey.fluidBlood), value: SampleType.FLUID_BLOOD },
                                    { label: t(i18n.translationKey.bloodUrine), value: SampleType.BLOOD_URINE },
                                    {
                                        label: t(i18n.translationKey.fluidUrineBlood),
                                        value: SampleType.FLUID_URINE_BLOOD,
                                    },
                                ]}
                                className="mb-2"
                            />
                            <FormItem
                                render="select"
                                name="sampleQuality"
                                label={t(i18n.translationKey.sampleQuality)}
                                required
                                options={[
                                    { label: t(i18n.translationKey.high), value: SampleQuality.HIGH },
                                    { label: t(i18n.translationKey.medium), value: SampleQuality.MEDIUM },
                                    { label: t(i18n.translationKey.low), value: SampleQuality.LOW },
                                ]}
                                className="mb-2"
                            />
                            <FormItem
                                render="text-input"
                                name=""
                                label={t(i18n.translationKey.concludedDoctor)}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                        value: user.name ?? "",
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction={"column"} size={8}>
                        <Grid
                            border={1}
                            borderColor={"primary.main"}
                            borderRadius={4}
                            padding={1}
                            container
                            direction={"column"}
                            sx={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                flexGrow: 1,
                            }}
                        >
                            <div className="my-2">
                                <FormItem
                                    render="select"
                                    name=""
                                    label={t(i18n.translationKey.serviceGroup)}
                                    options={
                                        examinationsOfReception === null
                                            ? []
                                            : examinationsOfReception.map(
                                                  (item: ExaminationOfReception, index: number) => ({
                                                      label: item.serviceName,
                                                      value: index,
                                                  }),
                                              )
                                    }
                                    value={`${selectedIndex}`}
                                    onChange={handleSelectServiceGroup}
                                />
                            </div>
                            <div className="flex-1">
                                <AgDataGrid
                                    isFullHeight={true}
                                    columnDefs={examinationResultColumnDefs}
                                    rowData={form.watch("serviceTestParameters") ?? []}
                                    {...examinationResultAgGrid}
                                />
                            </div>
                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            bgcolor={"warning.light"}
                            borderRadius={4}
                            sx={{
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                                borderBottomLeftRadius: 0,
                            }}
                            className="p-2 pt-4"
                        >
                            <Grid size={6}>
                                <FormItem
                                    render="text-area"
                                    name="conclusion"
                                    label={t(i18n.translationKey.conclusion)}
                                    rows={2}
                                    required
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormItem render="text-area" name="note" label={t(i18n.translationKey.note)} rows={2} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid offset={6} size={6} container spacing={2} marginTop={1} hidden={selectedIndex === -1}>
                        <ActionButton
                            label={t(i18n.translationKey.cancel)}
                            startIcon={<KeyboardReturn />}
                            size="small"
                            variant="outlined"
                            sx={{
                                borderRadius: 4,
                                px: 2,
                                flexGrow: 1,
                            }}
                            onClick={handleCancel}
                        />
                        <ActionButton
                            label={t(i18n.translationKey.save)}
                            startIcon={<Save />}
                            size="small"
                            variant="outlined"
                            sx={{
                                borderRadius: 4,
                                px: 2,
                                flexGrow: 1,
                            }}
                            onClick={form.handleSubmit(handleSaveExamination)}
                        />
                    </Grid>
                </Grid>
            </DynamicForm>
        </>
    );
};

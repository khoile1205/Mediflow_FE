import { AddCircle, Clear, Edit, RestartAlt, Save, Search, Undo } from "@mui/icons-material";
import { Box, Grid, Stack, Tooltip } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import { DistrictFormItem, ProvinceFormItem } from "~/components/form/custom";
import WardFormItem from "~/components/form/custom/ward.form-item";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { toBaseOption } from "~/components/form/utils";
import { EMAIL_PATTERN, PHONE_NUMBER_PATTERN, VIETNAMESE_ID_CARD_PATTERN } from "~/components/form/validation/pattern";
import { PatientSelectModal } from "~/components/modal/patient-select.modal";
import i18n from "~/configs/i18n";
import { Gender } from "~/constants/enums";
import { Patient } from "~/entities";
import { ServiceType } from "~/entities/service-type.entity";
import { useGeneratePatientCode, useMutationPatientReception } from "~/services/reception/hooks/mutations";
import {
    useQueryGetAvailablePatientReceptions,
    useQueryGetPrevaccinationByReceptionId,
    useQueryServiceTypes,
} from "~/services/reception/hooks/queries";
import { AvailablePatientReception, PatientReceptionRequest } from "~/services/reception/infras/types";
import { PreVaccination } from "./pre-vaccination";
import { TestIndication } from "./test_indication";
import { UnpaidCosts } from "./unpaid_costs";
import { VaccinationIndication } from "./vaccination_indication";
import { useCreateVaccinationForm } from "./hooks";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import { usePagination } from "~/hooks";
import SearchBox from "~/components/common/search-box";
import { showToast } from "~/utils";
import { useAuth } from "~/contexts/auth.context";
import { Role } from "~/constants/roles";

type TabType = "pre_vaccination" | "vaccination_indication" | "examination_indication" | "unpaid_costs";

const LockedSection: React.FC<{ locked: boolean; reason?: string; children: React.ReactNode }> = ({
    locked,
    reason,
    children,
}) => {
    if (!locked) return <Box position="relative">{children}</Box>;
    return (
        <Tooltip title={reason ?? "View only"}>
            <Box position="relative" sx={{ opacity: 0.5, filter: "grayscale(100%)" }}>
                {children}
                <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{ position: "absolute", inset: 0, zIndex: 1, cursor: "not-allowed" }}
                />
            </Box>
        </Tooltip>
    );
};

const ReceptionVaccination: React.FC = () => {
    const [tab, setTab] = React.useState<TabType>("pre_vaccination");
    const [isRecepting, setIsRecepting] = React.useState<boolean>(false);
    const [receptionId, setReceptionId] = React.useState<number | null>(null);
    const [isOpenPatientSelectModal, setIsOpenPatientSelectModal] = React.useState<boolean>(false);

    const { t } = useTranslation();
    const { pageIndex, pageSize, handlePageChange } = usePagination();
    const [searchPatientReception, setSearchPatientReception] = React.useState<string>("");

    // Mutation hooks
    const { mutateAsync: createPatientReception } = useMutationPatientReception();
    const { mutateAsync: generatePatientCode } = useGeneratePatientCode();

    // Queries hooks
    const { data: serviceTypes } = useQueryServiceTypes();
    const {
        data: availablePatientReceptions,
        totalItems,
        isLoading,
    } = useQueryGetAvailablePatientReceptions({
        pageIndex,
        pageSize,
        searchTerm: searchPatientReception,
    });
    const { data: prevaccinationData } = useQueryGetPrevaccinationByReceptionId(receptionId);

    const patientReceptionAgGrid = useAgGrid({});

    // Form setup
    const {
        patientReceptionForm,
        vaccinationPrescreeningForm,
        vaccinationIndicationForm,
        testExaminationIndicationForm,
    } = useCreateVaccinationForm();

    const handleSearch = (value: string) => {
        setSearchPatientReception(value);
    };

    const handlePopulatePatientReception = (patientReception: AvailablePatientReception) => {
        patientReceptionForm.setValue("patientId", patientReception.id, { shouldValidate: true });
        patientReceptionForm.setValue("code", patientReception.code, { shouldValidate: true });
        patientReceptionForm.setValue("name", patientReception.name, { shouldValidate: true });
        patientReceptionForm.setValue("addressDetail", patientReception.addressDetail, { shouldValidate: true });
        patientReceptionForm.setValue("gender", patientReception.gender, { shouldValidate: true });
        patientReceptionForm.setValue("email", patientReception.email, { shouldValidate: true });
        patientReceptionForm.setValue("dob", patientReception.dob ? new Date(patientReception.dob) : null);
        patientReceptionForm.setValue("phoneNumber", patientReception.phoneNumber, { shouldValidate: true });
        patientReceptionForm.setValue("identityCard", patientReception.identityCard, { shouldValidate: true });
        patientReceptionForm.setValue("province", patientReception.province, { shouldValidate: true });
        patientReceptionForm.setValue("district", patientReception.district, { shouldValidate: true });
        patientReceptionForm.setValue("ward", patientReception.ward, { shouldValidate: true });
        patientReceptionForm.setValue("receptionDate", patientReception.receptionDate, { shouldValidate: true });
        patientReceptionForm.setValue("isForeigner", patientReception.isForeigner);
        patientReceptionForm.setValue("serviceTypeId", patientReception.serviceTypeId, { shouldValidate: true });
    };

    const handleAddNewPatient = async () => {
        patientReceptionForm.reset();
        const patientCode = await generatePatientCode();
        patientReceptionForm.setValue("code", patientCode);
        setIsRecepting(true);
    };

    const handleSelectPatient = (patient: Patient) => {
        patientReceptionForm.reset();

        patientReceptionForm.setValue("patientId", patient.id, { shouldValidate: true });
        patientReceptionForm.setValue("code", patient.code, { shouldValidate: true });
        patientReceptionForm.setValue("name", patient.name, { shouldValidate: true });
        patientReceptionForm.setValue("addressDetail", patient.addressDetail, { shouldValidate: true });
        patientReceptionForm.setValue("gender", patient.gender, { shouldValidate: true });
        patientReceptionForm.setValue("email", patient.email, { shouldValidate: true });
        patientReceptionForm.setValue("dob", patient.dob ? new Date(patient.dob) : null);
        patientReceptionForm.setValue("phoneNumber", patient.phoneNumber, { shouldValidate: true });
        patientReceptionForm.setValue("identityCard", patient.identityCard, { shouldValidate: true });
        patientReceptionForm.setValue("province", patient.province, { shouldValidate: true });
        patientReceptionForm.setValue("district", patient.district, { shouldValidate: true });
        patientReceptionForm.setValue("ward", patient.ward, { shouldValidate: true });
        patientReceptionForm.setValue("receptionDate", new Date(), { shouldValidate: true });
        patientReceptionForm.setValue("isForeigner", patient.isForeigner);

        setIsRecepting(true);
    };

    const handleCancel = () => {
        setIsRecepting(false);
        setReceptionId(null);

        patientReceptionForm.reset();
        vaccinationIndicationForm.reset();
        vaccinationPrescreeningForm.reset();
        testExaminationIndicationForm.reset();
        patientReceptionAgGrid.gridApi.deselectAll();
    };

    const handleReset = () => {
        const patientCode = patientReceptionForm.getValues("code");

        patientReceptionForm.reset();
        patientReceptionForm.setValue("code", patientCode);
    };

    const onSavePatient = async () => {
        const patientReceptionBody: PatientReceptionRequest = getPatientReceptionBody();
        const listPatientReceptingCode = availablePatientReceptions.map((item) => item.code);

        if (listPatientReceptingCode.includes(patientReceptionForm.getValues("code"))) {
            showToast.error(t(i18n.translationKey.patientAlreadyRecepted));
            return;
        }

        const { patientId, receptionId } = await createPatientReception(patientReceptionBody);
        patientReceptionForm.setValue("patientId", patientId);
        setReceptionId(receptionId);
    };

    const getPatientReceptionBody = () => {
        return {
            createPatientCommand: {
                code: patientReceptionForm.getValues("code"),
                name: patientReceptionForm.getValues("name"),
                gender: patientReceptionForm.getValues("gender"),
                dob: patientReceptionForm.getValues("dob"),
                phoneNumber: patientReceptionForm.getValues("phoneNumber"),
                identityCard: patientReceptionForm.getValues("identityCard"),
                email: patientReceptionForm.getValues("email"),
                addressDetail: patientReceptionForm.getValues("addressDetail"),
                province: patientReceptionForm.getValues("province"),
                district: patientReceptionForm.getValues("district"),
                ward: patientReceptionForm.getValues("ward"),
                isPregnant: patientReceptionForm.getValues("isPregnant"),
                isForeigner: patientReceptionForm.getValues("isForeigner"),
            },
            createReceptionDTO: {
                patientId: patientReceptionForm.getValues("patientId") ?? 0,
                receptionDate: patientReceptionForm.getValues("receptionDate"),
                serviceTypeId: patientReceptionForm.getValues("serviceTypeId"),
            },
            patientId: patientReceptionForm.getValues("patientId") ?? 0,
        };
    };

    React.useEffect(() => {
        if (patientReceptionForm.watch("gender") === Gender.MALE) {
            patientReceptionForm.setValue("isPregnant", false);
        }
    }, [patientReceptionForm.watch("gender")]);

    // const isEnableProcessSubtask = React.useMemo(() => {
    //     return isRecepting && receptionId != null;
    // }, [isRecepting, receptionId]);

    const { userPermission } = useAuth();
    const roles = (userPermission?.roles ?? []) as Role[];
    const isNurseOnly = roles.length > 0 && roles.every((r) => r === Role.Nurse);

    return (
        <>
            <DynamicForm form={patientReceptionForm}>
                <Stack spacing={1} direction="row" width="100%" className="px-4 py-5">
                    <ActionButton
                        label={t(i18n.translationKey.addNew)}
                        startIcon={<AddCircle />}
                        onClick={handleAddNewPatient}
                        disabled={receptionId != null}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.search)}
                        startIcon={<Search />}
                        onClick={() => {
                            setIsOpenPatientSelectModal(true);
                        }}
                        disabled={receptionId != null}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.reception)}
                        startIcon={<Save />}
                        disabled={receptionId != null}
                        onClick={() => {
                            if (isRecepting) {
                                patientReceptionForm.handleSubmit(onSavePatient)();
                            }
                        }}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.reset)}
                        startIcon={<RestartAlt />}
                        disabled={receptionId != null}
                        onClick={handleReset}
                    />
                    <ActionButton label={t(i18n.translationKey.cancel)} startIcon={<Undo />} onClick={handleCancel} />
                </Stack>

                <Stack spacing={2} direction="row" width="100%">
                    <Box className="basis-full lg:basis-2/5 2xl:basis-1/3">
                        <SearchBox
                            onChange={handleSearch}
                            placeholder={t(i18n.translationKey.enterMedicalCode)}
                            className="mb-2"
                        />
                        <AgDataGrid
                            // isFullHeight
                            maxRows={5}
                            columnDefs={[
                                {
                                    field: "code",
                                    headerName: t(i18n.translationKey.medicalCode),
                                    flex: 1,
                                },
                                {
                                    field: "name",
                                    headerName: t(i18n.translationKey.fullName),
                                    flex: 1,
                                },
                                {
                                    field: "gender",
                                    headerName: t(i18n.translationKey.gender),
                                    valueFormatter: ({ value }) => {
                                        return value === Gender.FEMALE
                                            ? t(i18n.translationKey.female)
                                            : t(i18n.translationKey.male);
                                    },
                                    flex: 0.5,
                                },
                            ]}
                            rowData={availablePatientReceptions}
                            pagination
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            totalItems={totalItems}
                            onPageChange={handlePageChange}
                            onRowClicked={(row) => {
                                setReceptionId(row.data.receptionId);
                                handlePopulatePatientReception(row.data);
                            }}
                            loading={isLoading}
                            {...patientReceptionAgGrid}
                        />
                    </Box>
                    <Box
                        sx={{ borderColor: "primary.main", borderRadius: 2 }}
                        className="mt-2 basis-full border px-2 py-4 sm:px-4 lg:basis-3/5 2xl:basis-2/3"
                    >
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                                <FormItem
                                    name="code"
                                    render="text-input"
                                    placeholder={t(i18n.translationKey.medicalCode)}
                                    label={t(i18n.translationKey.medicalCode)}
                                    required
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                    disabled={!isRecepting}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                                <FormItem
                                    name="name"
                                    render="text-input"
                                    placeholder={t(i18n.translationKey.fullName)}
                                    label={t(i18n.translationKey.fullName)}
                                    required
                                    slotProps={{
                                        input: {
                                            readOnly: receptionId != null,
                                        },
                                    }}
                                    disabled={!isRecepting}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                                <FormItem
                                    name="identityCard"
                                    render="text-input"
                                    placeholder={`${t(i18n.translationKey.identityCard)}/${t(i18n.translationKey.passport)}`}
                                    label={`${t(i18n.translationKey.identityCard)}/${t(i18n.translationKey.passport)}`}
                                    required
                                    slotProps={{
                                        input: {
                                            readOnly: receptionId != null,
                                        },
                                    }}
                                    disabled={!isRecepting}
                                    pattern={VIETNAMESE_ID_CARD_PATTERN}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                                <FormItem
                                    name="gender"
                                    render="select"
                                    placeholder={t(i18n.translationKey.gender)}
                                    label={t(i18n.translationKey.gender)}
                                    // required
                                    readOnly={receptionId != null}
                                    options={[
                                        { label: t(i18n.translationKey.male), value: Gender.MALE },
                                        { label: t(i18n.translationKey.female), value: Gender.FEMALE },
                                    ]}
                                    disabled={!isRecepting}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                                <FormItem
                                    name="dob"
                                    render="date-picker"
                                    placeholder={t(i18n.translationKey.dateOfBirth)}
                                    label={t(i18n.translationKey.dateOfBirth)}
                                    required
                                    defaultValue={new Date()}
                                    maxDate={new Date()}
                                    disabled={!isRecepting}
                                    datePickerProps={{
                                        readOnly: receptionId != null,
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                                <FormItem
                                    name="phoneNumber"
                                    render="text-input"
                                    placeholder={t(i18n.translationKey.phoneNumber)}
                                    label={t(i18n.translationKey.phoneNumber)}
                                    required
                                    slotProps={{
                                        input: {
                                            readOnly: receptionId != null,
                                        },
                                    }}
                                    pattern={PHONE_NUMBER_PATTERN}
                                    disabled={!isRecepting}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                                <FormItem
                                    name="email"
                                    render="text-input"
                                    placeholder={t(i18n.translationKey.email)}
                                    label={t(i18n.translationKey.email)}
                                    required
                                    slotProps={{
                                        input: {
                                            readOnly: receptionId != null,
                                        },
                                    }}
                                    pattern={EMAIL_PATTERN}
                                    disabled={!isRecepting}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4, xl: 2 }}>
                                <Box className="flex items-center justify-center">
                                    <FormItem
                                        name="isForeigner"
                                        render="switch"
                                        switchProps={{
                                            readOnly: receptionId != null,
                                        }}
                                        label={t(i18n.translationKey.foreignPatient)}
                                        defaultValue={true}
                                        disabled={!isRecepting}
                                    />
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4, xl: 1 }}>
                                <Box className="flex items-center justify-center">
                                    <FormItem
                                        render="switch"
                                        name="isPregnant"
                                        switchProps={{
                                            readOnly: receptionId != null,
                                        }}
                                        label={t(i18n.translationKey.pregnant)}
                                        disabled={!isRecepting || patientReceptionForm.watch("gender") === Gender.MALE}
                                    />
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                                <ProvinceFormItem
                                    name="province"
                                    required
                                    disabled={!isRecepting}
                                    readOnly={receptionId != null}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                                <DistrictFormItem
                                    name="district"
                                    required
                                    disabled={!isRecepting}
                                    readOnly={receptionId != null}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                                <WardFormItem name="ward" disabled={!isRecepting} readOnly={receptionId != null} />
                            </Grid>

                            <Grid size={12}>
                                <FormItem
                                    name="addressDetail"
                                    render="text-input"
                                    placeholder={t(i18n.translationKey.address)}
                                    label={t(i18n.translationKey.address)}
                                    required
                                    slotProps={{
                                        input: {
                                            readOnly: receptionId != null,
                                        },
                                    }}
                                    disabled={!isRecepting}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                                <FormItem
                                    render="date-time-picker"
                                    name="receptionDate"
                                    placeholder={t(i18n.translationKey.receptionTime)}
                                    label={t(i18n.translationKey.receptionTime)}
                                    required
                                    disabled={true}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                                <FormItem
                                    render="autocomplete"
                                    placeholder={t(i18n.translationKey.serviceType)}
                                    label={t(i18n.translationKey.serviceType)}
                                    name="serviceTypeId"
                                    options={toBaseOption<ServiceType>(serviceTypes, {
                                        label: "name",
                                        value: "id",
                                    })}
                                    required
                                    readOnly={receptionId != null}
                                    disabled={!isRecepting}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Stack>

                <Box sx={{ borderColor: "primary.main", borderRadius: 2 }} className="mt-5 border p-2">
                    <Stack spacing={5} direction="row" width="100%">
                        <ActionButton
                            label={t(i18n.translationKey.preScreening)}
                            startIcon={<AddCircle />}
                            onClick={() => setTab("pre_vaccination")}
                        />
                        <ActionButton
                            label={t(i18n.translationKey.vaccinationIndication)}
                            startIcon={<Edit />}
                            onClick={() => setTab("vaccination_indication")}
                        />
                        <ActionButton
                            label={t(i18n.translationKey.examinationIndication)}
                            startIcon={<Save />}
                            onClick={() => setTab("examination_indication")}
                        />
                        <ActionButton
                            label={t(i18n.translationKey.unpaidCost)}
                            startIcon={<Clear />}
                            onClick={() => setTab("unpaid_costs")}
                        />
                    </Stack>
                </Box>
                <Box sx={{ display: tab === "pre_vaccination" ? "block" : "none" }}>
                    <LockedSection locked={isNurseOnly} reason={t(i18n.translationKey.viewOnlyDueToRole)}>
                        <PreVaccination
                            receptionId={receptionId}
                            form={vaccinationPrescreeningForm}
                            patientDOB={patientReceptionForm.getValues("dob")}
                        />
                    </LockedSection>
                </Box>
            </DynamicForm>

            <Box sx={{ display: tab === "vaccination_indication" ? "block" : "none" }}>
                <LockedSection locked={isNurseOnly} reason={t(i18n.translationKey.viewOnlyDueToRole)}>
                    <VaccinationIndication
                        isPrescreening={!!prevaccinationData}
                        receptionId={receptionId}
                        isAllowedToVaccinate={vaccinationPrescreeningForm.watch("isEligibleForVaccination")}
                        form={vaccinationIndicationForm}
                    />
                </LockedSection>
            </Box>
            <Box sx={{ display: tab === "examination_indication" ? "block" : "none" }}>
                <LockedSection locked={isNurseOnly} reason={t(i18n.translationKey.viewOnlyDueToRole)}>
                    <TestIndication
                        // disabled={!isEnableProcessSubtask}
                        receptionId={receptionId}
                        isReferredToHospital={vaccinationPrescreeningForm.watch("isReferredToHospital")}
                        form={testExaminationIndicationForm}
                    />
                </LockedSection>
            </Box>
            <Box sx={{ display: tab === "unpaid_costs" ? "block" : "none" }}>
                <LockedSection locked={isNurseOnly} reason={t(i18n.translationKey.viewOnlyDueToRole)}>
                    <UnpaidCosts receptionId={receptionId} />
                </LockedSection>
            </Box>
            <PatientSelectModal
                open={isOpenPatientSelectModal}
                onClose={() => setIsOpenPatientSelectModal(false)}
                onSelect={handleSelectPatient}
            />
        </>
    );
};

export default ReceptionVaccination;

import { UseFormReturn } from "react-hook-form";
import { VaccinationPrescreeningFormValue } from "../types";
import React from "react";

const FIELD_KEYS = [
    "hasSevereFeverAfterPreviousVaccination",
    "hasAcuteOrChronicDisease",
    "isOnOrRecentlyEndedCorticosteroids",
    "hasAbnormalTemperatureOrVitals",
    "hasAbnormalHeartSound",
    "hasHeartValveDisorder",
    "hasNeurologicalAbnormalities",
    "isUnderweightBelow2000g",
    "hasOtherContraindications",
    "hasAbnormalCry",
    "hasPaleSkinOrLips",
    "hasPoorFeeding",
    "isPretermBelow34Weeks",
    "hasImmunodeficiencyOrSuspectedHiv",
] as const;

export const useConclusionCheckboxStatus = (form: UseFormReturn<VaccinationPrescreeningFormValue>) => {
    const values = form.watch(FIELD_KEYS);

    const [
        severeFever,
        acuteDisease,
        corticosteroids,
        abnormalVitals,
        heartSound,
        heartValve,
        neuroAbnormalities,
        underweight,
        hasOtherContraindications,
        abnormalCry,
        paleSkinOrLips,
        poorFeeding,
        pretermBelow34Weeks,
        immunodeficiencyOrSuspectedHiv,
    ] = values;

    const isContraindicatedEnabled = React.useMemo(() => hasOtherContraindications, [hasOtherContraindications]);

    const isDeferredEnabled = React.useMemo(
        () =>
            severeFever ||
            acuteDisease ||
            corticosteroids ||
            abnormalVitals ||
            heartSound ||
            heartValve ||
            neuroAbnormalities ||
            underweight ||
            paleSkinOrLips ||
            poorFeeding ||
            pretermBelow34Weeks ||
            immunodeficiencyOrSuspectedHiv ||
            abnormalCry,
        [
            severeFever,
            acuteDisease,
            corticosteroids,
            abnormalVitals,
            heartSound,
            heartValve,
            neuroAbnormalities,
            underweight,
            paleSkinOrLips,
            poorFeeding,
            pretermBelow34Weeks,
            immunodeficiencyOrSuspectedHiv,
            abnormalCry,
        ],
    );

    const isEligibleEnabled = React.useMemo(() => values.every((v) => !v), [values]);

    return {
        isEligibleEnabled,
        isContraindicatedEnabled,
        isDeferredEnabled,
    };
};

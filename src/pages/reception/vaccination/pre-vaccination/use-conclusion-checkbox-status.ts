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
    ] = values;

    const isContraindicatedEnabled = React.useMemo(() => underweight, [underweight]);

    const isDeferredEnabled = React.useMemo(
        () =>
            severeFever ||
            acuteDisease ||
            corticosteroids ||
            abnormalVitals ||
            heartSound ||
            heartValve ||
            neuroAbnormalities,
        [severeFever, acuteDisease, corticosteroids, abnormalVitals, heartSound, heartValve, neuroAbnormalities],
    );

    const isEligibleEnabled = React.useMemo(() => values.every((v) => !v), [values]);

    return {
        isEligibleEnabled,
        isContraindicatedEnabled,
        isDeferredEnabled,
    };
};

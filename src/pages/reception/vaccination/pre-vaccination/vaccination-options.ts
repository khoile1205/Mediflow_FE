import i18n from "~/configs/i18n";

export const under1MonthOptions = [
    { name: "hasAcuteOrChronicDisease", labelKey: i18n.translationKey.acuteOrChronicDisease },
    { name: "hasAbnormalTemperatureOrVitals", labelKey: i18n.translationKey.feverOrHypothermia },
    { name: "isUnderweightBelow2000g", labelKey: i18n.translationKey.weightUnder2000g },
    { name: "hasAbnormalCry", labelKey: i18n.translationKey.abnormalCry },
    { name: "hasPaleSkinOrLips", labelKey: i18n.translationKey.paleSkinOrLips },
    { name: "hasPoorFeeding", labelKey: i18n.translationKey.poorFeeding },
    { name: "isPretermBelow34Weeks", labelKey: i18n.translationKey.pretermBelow34Weeks },
    { name: "hasImmunodeficiencyOrSuspectedHiv", labelKey: i18n.translationKey.immunodeficiencyOrSuspectedHiv },
    { name: "hasOtherContraindications", labelKey: i18n.translationKey.otherContraindications },
];

export const over1MonthOptions = [
    {
        name: "hasSevereFeverAfterPreviousVaccination",
        labelKey: i18n.translationKey.severeReactionPreviousVaccination,
    },
    { name: "hasAcuteOrChronicDisease", labelKey: i18n.translationKey.acuteOrChronicDisease },
    { name: "isOnOrRecentlyEndedCorticosteroids", labelKey: i18n.translationKey.recentImmunosuppressiveTreatment },
    { name: "hasAbnormalTemperatureOrVitals", labelKey: i18n.translationKey.feverOrHypothermia },
    { name: "hasAbnormalHeartSound", labelKey: i18n.translationKey.abnormalHeartSound },
    { name: "hasHeartValveDisorder", labelKey: i18n.translationKey.heartValveAbnormality },
    { name: "hasNeurologicalAbnormalities", labelKey: i18n.translationKey.abnormalConsciousness },
    { name: "isUnderweightBelow2000g", labelKey: i18n.translationKey.weightUnder2000g },
    { name: "hasOtherContraindications", labelKey: i18n.translationKey.otherContraindications },
];

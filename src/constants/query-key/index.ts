const QueryKeyPatient = {
    GET_LIST_PATIENT_WITH_PAGINATION: "getListPatientWithPagination",
    GET_PATIENT_BY_ID: "getPatientById",
    GET_PATIENT_BY_CODE: "getPatientByCode",
    GET_PATIENT_BY_PHONE_NUMBER: "getPatientByPhoneNumber",
    GET_PATIENT_BY_NAME: "getPatientByName",
};

const ReceptionQueryKey = {
    GENERATE_PATIENT_IDENTIFIER: "generatePatientIdentifier",
};

export const QueryKey = {
    PATIENT: QueryKeyPatient,
    RECEPTION: ReceptionQueryKey,
};

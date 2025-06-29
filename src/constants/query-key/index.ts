const QueryKeyPatient = {
    GET_LIST_PATIENT_WITH_PAGINATION: "getListPatientWithPagination",
    GET_PATIENT_BY_ID: "getPatientById",
    GET_PATIENT_BY_CODE: "getPatientByCode",
    GET_PATIENT_BY_PHONE_NUMBER: "getPatientByPhoneNumber",
    GET_PATIENT_BY_NAME: "getPatientByName",
};

const HospitalServiceQueryKey = {
    GET_HOSPITAL_SERVICE_GROUP_LIST: "getHospitalServiceGroupList",
    GET_HOSPITAL_DISEASE_GROUP_LIST: "getHospitalDiseaseGroupList",
    GET_HOSPITAL_SERVICE_LIST: "getHospitalServiceList",
};

const ReceptionQueryKey = {
    GENERATE_PATIENT_IDENTIFIER: "generatePatientIdentifier",
    GET_SERVICE_TYPES: "getServiceTypes",
    GET_UNPAID_SERVICES: "getUnpaidServices",
    GET_SERVICE_RECEPTION_BY_RECEPTION_ID: "getServiceReceptionByReceptionId",
};

const DepartmentQueryKey = {
    GET_LIST_DEPARTMENT_WITH_PAGINATION: "getListDepartmentWithPagination",
};

export const QueryKey = {
    PATIENT: QueryKeyPatient,
    RECEPTION: ReceptionQueryKey,
    HOSPITAL_SERVICE: HospitalServiceQueryKey,
    DEPARTMENT: DepartmentQueryKey,
};

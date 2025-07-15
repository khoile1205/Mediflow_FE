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
    GET_VACCINATION_RECEPTION_BY_RECEPTION_ID: "getVaccinationReceptionByReceptionId",
    GET_LATEST_RECEPTION_ID_BY_PATIENT_ID: "getLatestReceptionIdByPatientId",
};

const DepartmentQueryKey = {
    GET_LIST_DEPARTMENT_WITH_PAGINATION: "getListDepartmentWithPagination",
    GET_DEPARTMENT_BY_ID: "getDepartmentById",
    GET_LIST_DEPARTMENT_TYPES: "getListDepartmentTypes",
    CREATE_DEPARTMENT: "createDepartment",
    UPDATE_DEPARTMENT: "updateDepartment",
};

const InventoryQueryKey = {
    GET_ALL_MANUFACTURERS: "getAllManufacturers",
    GET_ALL_MANUFACTURE_COUNTRIES: "getAllManufactureCountries",
    GENERATE_DOCUMENT_CODE: "generateDocumentCode",
    CREATE_IMPORT_DOCUMENT: "createImportDocument",
    GET_LIST_SUPPLIER: "getListSupplier",
    SAVE_IMPORT_DOCUMENT: "saveImportDocument",
};

const PostVaccinationQueryKey = {
    GET_PATIENT_LIST: "getPostVaccinationPatients",
    GET_MEDICINE_LIST: "getPostVaccinationMedicines",
    UPDATE_RESULT: "updatePostVaccinationResult",
};

const HospitalFeeQueryKey = {
    GET_UNPAID_PATIENT_LIST: "getUnpaidPatientList",
    GET_PATIENT_PAYMENT_LIST: "getPatientPaymentList",
    GET_PAYMENT_DETAIL_BY_PAYMENT_ID: "getPaymentDetailByPaymentId",
    GET_UNPAID_SERVICE_BY_PATIENT_ID: "getUnpaidServiceByPatientId",
    CREATE_PAYMENT: "createPayment",
};

const UserQueryKey = {
    GET_LIST_USERS_WITH_PAGINATION: "getListUsersWithPagination",
    GET_USER_BY_ID: "getUserById",
    CREATE_USER: "createUser",
    UPDATE_USER: "updateUser",
    DELETE_USER: "deleteUser",
    GET_ROLE_NAMES: "getRoleNames",
    RESET_PASSWORD: "resetPassword",
};

const PreExaminationQueryKey = {
    GET_MEDICINE_LIST: "getPreExaminationMedicines",
    ADD_VACCINE_TO_PRE_EXAMINATION: "addVaccineToPreExamination",
    UPDATE_TEST_RESULT: "updatePreExaminationResult",
};

export const QueryKey = {
    PATIENT: QueryKeyPatient,
    RECEPTION: ReceptionQueryKey,
    HOSPITAL_SERVICE: HospitalServiceQueryKey,
    HOSPITAL_FEE: HospitalFeeQueryKey,
    DEPARTMENT: DepartmentQueryKey,
    INVENTORY: InventoryQueryKey,
    POST_VACCINATION: PostVaccinationQueryKey,
};

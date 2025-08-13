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
    GET_HOSPITAL_SERVICE_GROUP_LIST_WITH_PAGINATION: "getHospitalServiceGroupListWithPagination",
    GET_HOSPITAL_SERVICE_GROUP_ALL: "getHospitalServiceGroupAll",
    GET_HOSPITAL_DISEASE_GROUP_LIST_WITH_PAGINATION: "getHospitalDiseaseGroupListWithPagination",
    GET_HOSPITAL_DISEASE_GROUP_ALL: "getHospitalDiseaseGroupAll",
    GET_HOSPITAL_SERVICE_ALL: "getHospitalServiceAll",
    GET_HOSPITAL_SERVICE_DETAILS: "getHospitalServiceDetails",

    CREATE_HOSPITAL_SERVICE_GROUP: "createHospitalServiceGroup",
    UPDATE_HOSPITAL_SERVICE_GROUP: "updateHospitalServiceGroup",
    DELETE_HOSPITAL_SERVICE_GROUP: "deleteHospitalServiceGroup",
    ASSIGN_SERVICES_TO_GROUP: "assignServicesToGroup",
    REMOVE_SERVICES_FROM_GROUP: "removeServicesFromGroup",

    CREATE_HOSPITAL_SERVICE: "createHospitalService",
    UPDATE_HOSPITAL_SERVICE: "updateHospitalService",
    DELETE_HOSPITAL_SERVICE: "deleteHospitalService",
    GET_SERVICES_BY_IDS: "getServicesByIds",
    GET_SERVICES_BY_GROUP_ID: "getServicesByGroupId",

    GET_ALL_EXAMINATION_SERVICE: "getAllExaminationService",
    CREATE_EXAMINATION_SERVICE: "createExaminationService",
    UPDATE_EXAMINATION_SERVICE: "updateExaminationService",
    DELETE_EXAMINATION_SERVICE: "deleteExaminationService",
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
    SAVE_IMPORT_DOCUMENT: "saveImportDocument",
    GET_LIST_INVENTORY_LIMIT_STOCK: "getListInventoryLimitStock",
    CREATE_INVENTORY_LIMIT_STOCK: "createInventoryLimitStock",
    UPDATE_INVENTORY_LIMIT_STOCK: "updateInventoryLimitStock",
    DELETE_INVENTORY_LIMIT_STOCK: "deleteInventoryLimitStock",
    GET_LIST_WITH_PAGINATION: "inventoryGetMedicineList",
    CREATE_MEDICINE: "createMedicine",
    GET_VACCINE_TYPES: "getVaccineTypes",
    GET_MEDICINE_INTERACTIONS_WITH_PAGINATION: "getMedicineInteractionsWithPagination",
    DELETE_MEDICINE_INTERACTION: "deleteMedicineInteraction",
    CREATE_MEDICINE_INTERACTION: "createMedicineInteraction",
    GET_MEDICINE_PRICES_WITH_PAGINATION: "getMedicinePricesWithPagination",
    CREATE_MEDICINE_PRICE: "createMedicinePrice",
    UPDATE_MEDICINE_PRICE: "updateMedicinePrice",
    DELETE_MEDICINE_PRICE: "deleteMedicinePrice",
    GET_MEDICINE_BATCHES_WITH_PAGINATION: "getMedicineBatchesWithPagination",
    GET_MEDICINE_BATCH_BY_ID: "getMedicineBatchById",
    CREATE_MEDICINE_BATCH: "createMedicineBatch",
    UPDATE_MEDICINE_BATCH: "updateMedicineBatch",
    DELETE_MEDICINE_BATCH: "deleteMedicineBatch",
    GET_EXPIRY_MEDICINE_BATCH: "getExpiryMedicineBatch",
    GET_EXPIRY_RETURN_CODE: "getExpiryReturnCode",
    GENERATE_EXPIRY_RETURN_CODE: "generateExpiryReturnCode",
    GET_MEDICINE_BATCHES_BY_ID: "getMedicineBatchesById",
    GET_MEDICINE_BATCHES_BY_ID_FOR_RETURN: "getMedicineBatchesByIdForReturn",
    CREATE_EXPIRED_FORM: "createExpiredForm",
    GET_EXPIRED_MEDICINE_BATCH: "getExpiredMedicineBatch",
    APPROVE_EXPIRED_FORM: "approveExpiredForm",
    REJECT_EXPIRED_FORM: "rejectExpiredForm",
    CREATE_EXPIRED_RETURN: "createExpiredReturn",
    GET_EXPIRED_MEDICINE_BATCH_FORM_BY_ID: "getExpiredMedicineBatchFormById",
    GET_ALL_EXPIRED_MEDICINE_BATCHES: "getAllExpiredMedicineBatches",
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

const VaccinationQueryKey = {
    GET_WAITING_PATIENT_VACCINATION_LIST: "getWaitingPatientVaccinationList",
    GET_MEDICINE_VACCINATION_LIST_BY_RECEPTION_ID: "getMedicineVaccinationListByReceptionId",
    GET_NEAREST_EXPIRY_MEDICINE_BATCH: "getNearestExpiryMedicineBatch",
    UPDATE_VACCINATION_STATUS: "updateVaccinationStatus",
    INJECT_VACCINATION: "injectVaccination",
    CONFIRM_VACCINATION_TODAY: "confirmVaccinationToday",
    GET_VACCINATION_HISTORY_BY_PATIENT_ID: "getVaccinationHistoryByPatientId",
};

const AppointmentQueryKey = {
    GET_UPCOMING_APPOINTMENTS: "getUpcomingAppointments",
    GET_APPOINTMENT_BY_ID: "getAppointmentById",
};

const ExaminationQueryKey = {
    GET_PATIENTS_FOR_EXAMINATION: "getPatientsForExamination",
    GET_ALL_EXAMINATION_OF_RECEPTION_BY_RECEPTION_ID: "getAllExaminationOfReceptionByReceptionId",
    GET_SERVICE_TEST_PARAMETERS_OF_EXAMINATION_BY_EXAMINATION_ID:
        "getServiceTestParametersOfExaminationByExaminationId",
    GET_PATIENT_EXAMINATION_DETAIL_BY_EXAMINATION_ID: "getPatientExaminationDetailByExaminationId",
    UPSERT_EXAMINATION_RESULT: "upsertExaminationResult",
    GET_ALL_EXAMINATION_TECHNICIAN: "getAllExaminationTechnician",
    GET_ALL_EXAMINATION_HISTORY: "getAllExaminationHistory",
    GET_PATIENT_EXAMINATION_HISTORY: "getPatientExaminationHistory",
    GET_EXAMINATION_HISTORY_DETAIL_BY_ID: "getExaminationHistoryDetailById",
};

const AuthQueryKey = {
    CONFIRM_PASSWORD: "confirmPassword",
};

const UploadFileQueryKey = {
    UPLOAD_FILE: "uploadFile",
    CREATE_DOWNLOAD_URL: "createDownloadUrl",
    DELETE_FILE: "deleteFile",
};

const SupplierQueryKey = {
    GET_LIST_SUPPLIER: "getListSupplier",
    GET_SUPPLIER_BY_ID: "getSupplierById",
    CREATE_SUPPLIER: "createSupplier",
    UPDATE_SUPPLIER: "updateSupplier",
    DELETE_SUPPLIER: "deleteSupplier",
};

export const QueryKey = {
    SUPPLIER: SupplierQueryKey,
    UPLOAD_FILE: UploadFileQueryKey,
    PATIENT: QueryKeyPatient,
    RECEPTION: ReceptionQueryKey,
    HOSPITAL_SERVICE: HospitalServiceQueryKey,
    HOSPITAL_FEE: HospitalFeeQueryKey,
    DEPARTMENT: DepartmentQueryKey,
    INVENTORY: InventoryQueryKey,
    VACCINATION: VaccinationQueryKey,
    POST_VACCINATION: PostVaccinationQueryKey,
    PRE_EXAMINATION: PreExaminationQueryKey,
    USER: UserQueryKey,
    APPOINTMENT: AppointmentQueryKey,
    EXAMINATION: ExaminationQueryKey,
    AUTH: AuthQueryKey,
};

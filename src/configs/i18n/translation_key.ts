const validationTranslationKey = {
    requiredField: "REQUIRED_FIELD",
    enterAtLeastMinLengthCharacter: "ENTER_AT_LEAST_MIN_LENGTH_CHARACTER",
    onlyEnterUpToMaxLengthCharacter: "ONLY_ENTER_UP_TO_MAX_LENGTH_CHARACTER",
    valueMustBeGreaterThanOrEqualTo: "VALUE_MUST_BE_GREATER_THAN_OR_EQUAL_TO",
    valueMustBeLessThanOrEqualTo: "VALUE_MUST_BE_LESS_THAN_OR_EQUAL_TO",
    invalidFormat: "INVALID_FORMAT",
    invalidEmail: "INVALID_EMAIL",
    pleaseSelectADateAfter: "PLEASE_SELECT_A_DATE_AFTER",
    pleaseSelectADateBefore: "PLEASE_SELECT_A_DATE_BEFORE",
    dateMustNotBeInThePast: "DATE_MUST_NOT_BE_IN_THE_PAST",
    dateMustNotBeInTheFuture: "DATE_MUST_NOT_BE_IN_THE_FUTURE",
};

const applicationTranslationKey = {
    login: "LOGIN",
    username: "USERNAME",
    password: "PASSWORD",
    pleaseLoginToContinue: "PLEASE_LOGIN_TO_CONTINUE",
    somethingWentWrong: "SOMETHING_WENT_WRONG",
    tokenExpired: "TOKEN_EXPIRED",
    logoutSuccessfully: "LOGOUT_SUCCESSFULLY",
    loginSuccessfully: "LOGIN_SUCCESSFULLY",
    noDataToDisplay: "NO_DATA_TO_DISPLAY",
    loading: "LOADING",
    medicalCode: "MEDICAL_CODE",
    vaccinationNumber: "VACCINATION_NUMBER",
    patientName: "PATIENT_NAME",
    yearOfBirth: "YEAR_OF_BIRTH",
    content: "CONTENT",
    quantity: "QUANTITY",
    amountBeforeDiscount: "AMOUNT_BEFORE_DISCOUNT",
    discountAmount: "DISCOUNT_AMOUNT",
    amountAfterDiscount: "AMOUNT_AFTER_DISCOUNT",
    payment: "PAYMENT",
    printInvoice: "PRINT_INVOICE",
    deletePaymentOrder: "DELETE_PAYMENT_ORDER",
    refreshList: "REFRESH_LIST",
    invoiceNumber: "INVOICE_NUMBER",
    invoiceValue: "INVOICE_VALUE",
    paymentMethod: "PAYMENT_METHOD",
    payByCash: "PAY_BY_CASH",
    payByAtm: "PAY_BY_ATM",
    payByTransfer: "PAY_BY_TRANSFER",
    receipt: "RECEIPT",
    refund: "REFUND",
    cancelInvoice: "CANCEL_INVOICE",
    fullName: "FULL_NAME",
    age: "AGE",
    address: "ADDRESS",
    taxCode: "TAX_CODE",
    atmCode: "ATM_CODE",
    unitName: "UNIT_NAME",
    einvoiceStatus: "EINVOICE_STATUS",
    einvoiceNumber: "EINVOICE_NUMBER",
    hospitalService: "HOSPITAL_SERVICE",
    medicalAttachedService: "HOSPITAL_SERVICE",
    screeningForChildrenOver1Month: "SCREENING_FOR_CHILDREN_OVER_1_MONTH",
    screeningForChildrenUnder1Month: "SCREENING_FOR_CHILDREN_UNDER_1_MONTH",
    conclusion: "CONCLUSION",
    parentName: "PARENT_NAME",
    parentPhoneNumber: "PARENT_PHONE_NUMBER",
    phoneNumber: "PHONE_NUMBER",
    weight: "WEIGHT",
    temperature: "TEMPERATURE",
    bloodPressure: "BLOOD_PRESSURE",
    severeReactionPreviousVaccination: "SEVERE_REACTION_PREVIOUS_VACCINATION",
    acuteOrChronicDisease: "ACUTE_OR_CHRONIC_DISEASE",
    recentImmunosuppressiveTreatment: "RECENT_IMMUNOSUPPRESSIVE_TREATMENT",
    abnormalTemperatureOrVitals: "ABNORMAL_TEMPERATURE_OR_VITALS",
    abnormalHeartSound: "ABNORMAL_HEART_SOUND",
    heartValveAbnormality: "HEART_VALVE_ABNORMALITY",
    abnormalDisorder: "ABNORMAL_DISORDER",
    weightUnder2000g: "WEIGHT_UNDER_2000G",
    otherContraindications: "OTHER_CONTRAINDICATIONS",
    eligibleForVaccination: "ELIGIBLE_FOR_VACCINATION",
    contraindicatedForVaccination: "CONTRAINDICATED_FOR_VACCINATION",
    postponeVaccination: "POSTPONE_VACCINATION",
    referToHospital: "REFER_TO_HOSPITAL",
    unitKg: "UNIT_KG",
    unitCelsius: "UNIT_CELSIUS",
    unitMmhg: "UNIT_MMHG",
    requestNumber: "REQUEST_NUMBER",
    serviceCode: "SERVICE_CODE",
    serviceName: "SERVICE_NAME",
    unitPrice: "UNIT_PRICE",
    totalAmount: "TOTAL_AMOUNT",
    invoiceDate: "INVOICE_DATE",
    examinationIndication: "EXAMINATION_ORDER",
    orderByDiseaseGroup: "ORDER_BY_DISEASE_GROUP",
    selectDiseaseGroup: "SELECT_DISEASE_GROUP",
    selectExaminationService: "SELECT_EXAMINATION_SERVICE",
    department: "DEPARTMENT",
    selectDepartment: "SELECT_DEPARTMENT",
    serviceGroup: "SERVICE_GROUP",
    selectServiceGroup: "SELECT_SERVICE_GROUP",
    addByGroup: "ADD_BY_GROUP",
    addHospitalService: "ADD_HOSPITAL_SERVICE",
    delete: "DELETE",
    examinationIndicationList: "EXAMINATION_ORDER_LIST",
    unpaidCost: "UNPAID_COST",
    consultationFee: "CONSULTATION_FEE",
    examinationFee: "EXAMINATION_FEE",
    injectionFee: "INJECTION_FEE",
    vaccinePrice: "VACCINE_PRICE",
    examinationPrice: "EXAMINATION_PRICE",
    temporaryTotalUnpaidCost: "TEMPORARY_TOTAL_UNPAID_COST",
    vaccinationIndication: "VACCINATION_INDICATION",
    vaccinationIndicationList: "VACCINATION_INDICATION_LIST",
    vaccine: "VACCINE",
    selectVaccine: "SELECT_VACCINE",
    doseNumber: "DOSE_NUMBER",
    selectDose: "SELECT_DOSE",
    appointmentDate: "APPOINTMENT_DATE",
    note: "NOTE",
    addNew: "ADD_NEW",
    deleteSelectedIndications: "DELETE_SELECTED_INDICATIONS",
    approveUsage: "APPROVE_USAGE",
    disapproveUsage: "DISAPPROVE_USAGE",
    useToday: "USE_TODAY",
    vaccineSerumType: "VACCINE_SERUM_TYPE",
    vaccineSerumName: "VACCINE_SERUM_NAME",
    allowUsage: "ALLOW_USAGE",
    usageDate: "USAGE_DATE",
    injectionDate: "INJECTION_DATE",
    instructedDoctor: "INSTRUCTED_DOCTOR",
    vaccinationHistory: "VACCINATION_HISTORY",
    vaccinationConfirmation: "VACCINATION_CONFIRMATION",
    search: "SEARCH",
    edit: "EDIT",
    save: "SAVE",
    cancel: "CANCEL",
    preScreening: "PRE_SCREENING",
    gender: "GENDER",
    dateOfBirth: "DATE_OF_BIRTH",
    specificAddress: "SPECIFIC_ADDRESS",
    foreignPatient: "FOREIGN_PATIENT",
    receptionTime: "RECEPTION_TIME",
    patientType: "PATIENT_TYPE",
    pregnant: "PREGNANT",
    male: "MALE",
    female: "FEMALE",
    province: "PROVINCE",
    district: "DISTRICT",
    ward: "WARD",
    home: "HOME",
    reception: "RECEPTION",
    vaccination: "VACCINATION",
    patient: "PATIENT",
    hospitalFee: "HOSPITAL_FEE",
    pharmacy: "PHARMACY",
    importPharmacy: "IMPORT_PHARMACY",
    signOut: "SIGN_OUT",
    vietnamese: "VIETNAMESE",
    english: "ENGLISH",
    enterMedicalCode: "ENTER_MEDICAL_CODE",
    inventory: "INVENTORY",
    documentCode: "DOCUMENT_CODE",
    documentNumber: "DOCUMENT_NUMBER",
    importDate: "IMPORT_DATE",
    supplier: "SUPPLIER",
    warehouseNote: "WAREHOUSE_NOTE",
    basedOn: "BASED_ON",
    endAt: "END_AT",
    receiver: "RECEIVER",
    pharmaceuticalInformation: "PHARMACEUTICAL_INFORMATION",
    medicineName: "MEDICINE_NAME",
    batchNumber: "BATCH_NUMBER",
    expiryDate: "EXPIRY_DATE",
    sgkCpnk: "SGK_CPNK",
    manufacturer: "MANUFACTURER",
    countryOfOrigin: "COUNTRY_OF_MANUFACTURER",
    noCharge: "NO_CHARGE",
    warehouseImport: "WAREHOUSE_IMPORT",
    source: "SOURCE",
    unit: "UNIT",
    index: "INDEX",
    pleaseSelectRowToDelete: "PLEASE_SELECT_ROW_TO_DELETE",
    addNewDocument: "ADD_NEW_DOCUMENT",
    supplierCode: "SUPPLIER_CODE",
    pleaseAddPharmaceuticalInformation: "PLEASE_ADD_PHARMACEUTICAL_INFORMATION",
    documentCreateSuccessfully: "DOCUMENT_CREATE_SUCCESSFULLY",
    serviceType: "SERVICE_TYPE",
    identityCard: "IDENTITY_CARD",
    passport: "PASSPORT",
    departmentCode: "DEPARTMENT_CODE",
    reset: "RESET",
    receive: "RECEIVE",
    testResult: "TEST_RESULT",
    testStartTime: "TEST_START_TIME",
    sendToCustomer: "SEND_TO_CUSTOMER",
    confirmStart: "CONFIRM_START",
    confirmInjectedToday: "CONFIRM_INJECTED_TODAY",
    cancelConfirm: "CANCEL_CONFIRMATION",
    saveNote: "SAVE_NOTE",
    confirmSelectedDose: "CONFIRM_SELECTED_DOSE",
    transferSelectedDose: "TRANSFER_SELECTED_DOSE",
    findPatient: "FIND_PATIENT",
    email: "EMAIL",
    createServiceReceptionSuccessfully: "CREATE_SERVICE_RECEPTION_SUCCESSFULLY",
    patientReceptionSuccessfully: "PATIENT_RECEPTION_SUCCESSFULLY",
    createVaccinationPrescreeningSuccessfully: "CREATE_VACCINATION_PRESCREENING_SUCCESSFULLY",
    deleteServiceReceptionSuccessfully: "DELETE_SERVICE_RECEPTION_SUCCESSFULLY",
    updateVaccinationPrescreeningSuccessfully: "UPDATE_VACCINATION_PRESCREENING_SUCCESSFULLY",
    noNeedToTakeReferExam: "NO_NEED_TO_TAKE_REFER_EXAM",
    injectionCompleteTime: "INJECTION_COMPLETE_TIME",
    confirmFollowUp: "CONFIRM_FOLLOW_UP",
    negative: "NEGATIVE",
    positive: "POSITIVE",
    reactionOccurred: "REACTION_OCCURRED",
    postVaccinationResult: "POST_VACCINATION_RESULT",
    commonReactions: "COMMON_REACTIONS",
    feverOver39: "FEVER_OVER_39",
    painAtInjectionSite: "PAIN_AT_INJECTION_SITE",
    other: "OTHER",
    otherSymptoms: "OTHER_SYMPTOMS",
    reactionAfterInjectionTime: "REACTION_AFTER_INJECTION_TIME",
    no: "NO",
    reactionDate: "REACTION_DATE",
    AfterInjection: "AFTER_INJECTION",
    concentration: "CONCENTRATION",
    injectionRoute: "INJECTION_ROUTE",
    isInjected: "IS_INJECTED",
    notInjected: "NOT_INJECTED",
    notAvailable: "NOT_AVAILABLE",
    update: "UPDATE",
    createVaccinationIndicationSuccessfully: "CREATE_VACCINATION_INDICATION_SUCCESSFULLY",
    updateVaccinationIndicationSuccessfully: "UPDATE_VACCINATION_INDICATION_SUCCESSFULLY",
    deleteVaccinationIndicationSuccessfully: "DELETE_VACCINATION_INDICATION_SUCCESSFULLY",
};

const exceptionTranslationKey = {
    notFoundUserWithId: "NOT_FOUND_USER_WITH_ID",
    notFoundUserWithEmail: "NOT_FOUND_USER_WITH_EMAIL",
    invalidLoginCredential: "INVALID_LOGIN_CREDENTIAL",
    failedUpdateUserWithId: "FAILED_UPDATE_USER_WITH_ID",
    failedResetPassword: "FAILED_RESET_PASSWORD",
    failedChangePassword: "FAILED_CHANGE_PASSWORD",
    failedAssignRoleToUser: "FAILED_ASSIGN_ROLE_TO_USER",
    notFoundRoleWithId: "NOT_FOUND_ROLE_WITH_ID",
    notFoundDepartmentWithId: "NOT_FOUND_DEPARTMENT_WITH_ID",
    notFoundPermissionWithId: "NOT_FOUND_PERMISSION_WITH_ID",
    notFoundPolicyWithId: "NOT_FOUND_POLICY_WITH_ID",
    cannotDeletePolicyWithRelationships: "CANNOT_DELETE_POLICY_WITH_RELATIONSHIPS",
    policyAssignmentAlreadyExists: "POLICY_ASSIGNMENT_ALREADY_EXISTS",
    existedDepartmentCode: "EXISTED_DEPARTMENT_CODE",
    invalidRequest: "INVALID_REQUEST",
    invalidDepartmentType: "INVALID_DEPARTMENT_TYPE",
    notFoundWarehouseWithId: "NOT_FOUND_WAREHOUSE_WITH_ID",
    notFoundWarehouseWithCode: "NOT_FOUND_WAREHOUSE_WITH_CODE",
    failedUpdateWarehouseWithId: "FAILED_UPDATE_WAREHOUSE_WITH_ID",
    failedDeleteWarehouseWithId: "FAILED_DELETE_WAREHOUSE_WITH_ID",
    duplicateWarehouseCode: "DUPLICATE_WAREHOUSE_CODE",
    notFoundWarehouseTypeWithId: "NOT_FOUND_WAREHOUSE_TYPE_WITH_ID",
    notFoundWarehouseTypeWithCode: "NOT_FOUND_WAREHOUSE_TYPE_WITH_CODE",
    notFoundSupplierWithId: "NOT_FOUND_SUPPLIER_WITH_ID",
    notFoundSupplierWithCode: "NOT_FOUND_SUPPLIER_WITH_CODE",
    failedCreateSupplierWithId: "FAILED_CREATE_SUPPLIER_WITH_ID",
    failedUpdateSupplierWithId: "FAILED_UPDATE_SUPPLIER_WITH_ID",
    failedDeleteSupplierWithId: "FAILED_DELETE_SUPPLIER_WITH_ID",
    duplicateSupplierCode: "DUPLICATE_SUPPLIER_CODE",
    notFoundMedicineWithId: "NOT_FOUND_MEDICINE_WITH_ID",
    notFoundMedicineWithCode: "NOT_FOUND_MEDICINE_WITH_CODE",
    notFoundMedicineWithName: "NOT_FOUND_MEDICINE_WITH_NAME",
    failedCreateMedicine: "FAILED_CREATE_MEDICINE",
    failedUpdateMedicineWithId: "FAILED_UPDATE_MEDICINE_WITH_ID",
    failedDeleteMedicineWithId: "FAILED_DELETE_MEDICINE_WITH_ID",
    duplicateMedicineCode: "DUPLICATE_MEDICINE_CODE",
    medicineExpired: "MEDICINE_EXPIRED",
    medicineNearExpiry: "MEDICINE_NEAR_EXPIRY",
    incompatibleMedicines: "INCOMPATIBLE_MEDICINES",
    interactionAlreadyExists: "INTERACTION_ALREADY_EXISTS",
    failedUpdateInteractionWithId: "FAILED_UPDATE_INTERACTION_WITH_ID",
    failedDeleteInteractionWithId: "FAILED_DELETE_INTERACTION_WITH_ID",
    invalidInteractionSeverity: "INVALID_INTERACTION_SEVERITY",
    notFoundInteractionWithId: "NOT_FOUND_INTERACTION_WITH_ID",
    invalidInventoryOperation: "INVALID_INVENTORY_OPERATION",
    insufficientStock: "INSUFFICIENT_STOCK",
    notFoundPatientWithId: "NOT_FOUND_PATIENT_WITH_ID",
    invalidVaccinationReceptionId: "INVALID_VACCINATION_RECEPTION_ID",
    invalidVaccinationReceptionIdList: "INVALID_VACCINATION_RECEPTION_ID_LIST",
    failedDeleteVaccinationReception: "FAILED_DELETE_VACCINATION_RECEPTION",
    notFoundVaccinationReceptionWithId: "NOT_FOUND_VACCINATION_RECEPTION_WITH_ID",
    notFoundUnpaidServicesWithReceptionId: "NOT_FOUND_UNPAID_SERVICES_WITH_RECEPTION_ID",
    requiredPatientInfo: "REQUIRED_PATIENT_INFO",
    requiredPatientCode: "REQUIRED_PATIENT_CODE",
    invalidPatientCodeMaxLength: "INVALID_PATIENT_CODE_MAX_LENGTH",
    requiredPatientName: "REQUIRED_PATIENT_NAME",
    invalidPatientNameMaxLength: "INVALID_PATIENT_NAME_MAX_LENGTH",
    requiredPatientGender: "REQUIRED_PATIENT_GENDER",
    invalidPatientGender: "INVALID_PATIENT_GENDER",
    requiredPatientDob: "REQUIRED_PATIENT_DOB",
    invalidPatientDob: "INVALID_PATIENT_DOB",
    requiredPatientPhone: "REQUIRED_PATIENT_PHONE",
    invalidPatientPhoneFormat: "INVALID_PATIENT_PHONE_FORMAT",
    invalidPatientPhoneMaxLength: "INVALID_PATIENT_PHONE_MAX_LENGTH",
    requiredPatientIdentityCard: "REQUIRED_PATIENT_IDENTITY_CARD",
    invalidPatientIdentityCardFormat: "INVALID_PATIENT_IDENTITY_CARD_FORMAT",
    invalidPatientIdentityCardMaxLength: "INVALID_PATIENT_IDENTITY_CARD_MAX_LENGTH",
    requiredPatientAddressDetail: "REQUIRED_PATIENT_ADDRESS_DETAIL",
    invalidPatientAddressMaxLength: "INVALID_PATIENT_ADDRESS_MAX_LENGTH",
    requiredPatientProvince: "REQUIRED_PATIENT_PROVINCE",
    invalidPatientProvinceMaxLength: "INVALID_PATIENT_PROVINCE_MAX_LENGTH",
    requiredPatientDistrict: "REQUIRED_PATIENT_DISTRICT",
    invalidPatientDistrictMaxLength: "INVALID_PATIENT_DISTRICT_MAX_LENGTH",
    requiredPatientWard: "REQUIRED_PATIENT_WARD",
    invalidPatientWardMaxLength: "INVALID_PATIENT_WARD_MAX_LENGTH",
    patientCodeExists: "PATIENT_CODE_EXISTS",
    failedCreatePatient: "FAILED_CREATE_PATIENT",
    failedUpdatePatient: "FAILED_UPDATE_PATIENT",
    failedDeletePatient: "FAILED_DELETE_PATIENT",
    requiredVaccinationReceptionInfo: "REQUIRED_VACCINATION_RECEPTION_INFO",
    invalidGroupId: "INVALID_GROUP_ID",
    invalidGroupType: "INVALID_GROUP_TYPE",
    invalidData: "INVALID_DATA",
    requiredVaccinationReceptionId: "REQUIRED_VACCINATION_RECEPTION_ID",
    requiredVaccinationReceptionDate: "REQUIRED_VACCINATION_RECEPTION_DATE",
    invalidVaccinationReceptionDate: "INVALID_VACCINATION_RECEPTION_DATE",
    invalidServiceType: "INVALID_SERVICE_TYPE",
    pleaseSelectDiseaseGroupBeforeAdding: "PLEASE_SELECT_DISEASE_GROUP_BEFORE_ADDING",
    pleaseSelectServiceBeforeAdding: "PLEASE_SELECT_SERVICE_BEFORE_ADDING",
    vaccinationNotAllowed: "VACCINATION_NOT_ALLOWED",
};

export const TRANSLATION_KEY = {
    ...validationTranslationKey,
    ...applicationTranslationKey,
    ...exceptionTranslationKey,
};

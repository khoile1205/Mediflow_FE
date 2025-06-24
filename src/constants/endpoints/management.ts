const managementEndpointPrefix = "/management";

const departmentEndpointPrefix = `${managementEndpointPrefix}/departments`;
const departmentEndpoints = {
    getDepartmentWithPagination: `${departmentEndpointPrefix}/`,
    getDepartmentById: (id: number) => `${departmentEndpointPrefix}/${id}`,
    createDepartment: `${departmentEndpointPrefix}`,
    updateDepartment: (id: number) => `${departmentEndpointPrefix}/${id}`,
    deleteDepartment: (id: number) => `${departmentEndpointPrefix}/${id}`,
    getDepartmentTypes: `${departmentEndpointPrefix}/types`,
    getEmployeesByDepartmentId: (id: number) => `${departmentEndpointPrefix}/${id}/employees`,
};

export const managementEndpoints = {
    departmentEndpoints,
};

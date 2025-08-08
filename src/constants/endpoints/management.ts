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

const userEndpointPrefix = `${managementEndpointPrefix}/users`;
const userEndpoints = {
    getUsersWithPagination: `${userEndpointPrefix}/`,
    getUserById: (id: number) => `${userEndpointPrefix}/${id}`,
    createUser: `${userEndpointPrefix}`,
    updateUser: (id: number) => `${userEndpointPrefix}/${id}`,
    deleteUser: (id: number) => `${userEndpointPrefix}/${id}`,
};

const roleEndpointPrefix = `${managementEndpointPrefix}/roles`;
const roleEndpoints = {
    getRoleNames: `${roleEndpointPrefix}/names`,
};

export const managementEndpoints = {
    departmentEndpoints,
    userEndpoints,
    roleEndpoints,
};

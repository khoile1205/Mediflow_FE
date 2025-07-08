const authEndpointPrefix = "/authentication";

export const authEndpoints = {
    login: `${authEndpointPrefix}/login`,
    logout: `${authEndpointPrefix}/logout`,
    currentUser: `${authEndpointPrefix}/current-user`,
    refreshToken: `${authEndpointPrefix}/login/refresh-token`,
    userPermission: `${authEndpointPrefix}/current-user/policies`,
};

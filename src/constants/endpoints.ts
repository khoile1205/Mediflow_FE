const authEndpointPrefix = "/authentication";

const authEndpoints = {
    login: `${authEndpointPrefix}/login`,
    logout: `${authEndpointPrefix}/logout`,
    me: `${authEndpointPrefix}/me`,
};

export const endpoints = { authEndpoints };

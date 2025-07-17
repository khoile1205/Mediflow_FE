const appointmentEndpointPrefix = "/appointment";

export const appointmentEndpoints = {
    getUpcomingAppointments: `${appointmentEndpointPrefix}/upcoming`,
    getAppointmentById: (id: number) => `${appointmentEndpointPrefix}/${id}`,
};

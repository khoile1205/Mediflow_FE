import { useMutation } from "@tanstack/react-query";
import { hospitalServiceApis } from "../../infras";
import { AssignServicesToGroupRequest } from "../../infras/types";

export const useMutationAssignServicesToGroup = () => {
    return useMutation({
        mutationFn: (data: AssignServicesToGroupRequest) => hospitalServiceApis.assignServicesToGroup(data),
    });
};

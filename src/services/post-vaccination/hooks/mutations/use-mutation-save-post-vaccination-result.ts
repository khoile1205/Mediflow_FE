import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "~/libs/axios/axios-instance";
import { PostVaccinationRequest } from "~/pages/post-vaccination/types";

const savePostVaccination = async (data: PostVaccinationRequest) => {
    const response = await axiosInstance.post("/api/post-vaccination", data);
    return response.data;
};

export const useMutationSavePostVaccination = () => {
    return useMutation({
        mutationFn: savePostVaccination,
    });
};

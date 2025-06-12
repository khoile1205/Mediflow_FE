import { SelectProps } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { getWardsByDistrict } from "~/services/vn-public-api";
import { TAdministrativeUnit } from "~/services/vn-public-api/types";
import FormItem from "../form-item";
import { BaseFormItemProps } from "../types/form-item";
import { toBaseOption } from "../utils";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";

type WardFormItemProps = Omit<BaseFormItemProps, "render" | "name"> & SelectProps;

const WardFormItem: React.FC<WardFormItemProps> = ({ ...props }) => {
    const { t } = useTranslation();

    const form = useFormContext();
    const [wards, setWards] = React.useState<TAdministrativeUnit[]>([]);

    const getWards = async () => {
        const selectedDistrict = form.watch("districtCode");

        if (!selectedDistrict) {
            return;
        }

        try {
            const response = await getWardsByDistrict(selectedDistrict);
            setWards(response.data.data);
        } catch (error) {
            console.error("Failed to fetch districts:", error);
        }
    };

    React.useEffect(() => {
        getWards();
    }, [form.watch("districtCode")]);

    return (
        <FormItem
            name="ward"
            label={t(i18n.translationKey.ward)}
            render="select"
            options={toBaseOption<TAdministrativeUnit>(wards, {
                label: "name_with_type",
                value: "name",
            })}
            {...props}
        />
    );
};

export default WardFormItem;

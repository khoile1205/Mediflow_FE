import React from "react";
import FormItem from "../form-item";
import { TAdministrativeUnit } from "~/services/vn-public-api/types";
import { getDistrictsByProvince } from "~/services/vn-public-api";
import { toBaseOption } from "../utils";
import { BaseFormItemProps } from "../types/form-item";
import { useFormContext } from "react-hook-form";
import { SelectChangeEvent, SelectProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";

type DistrictFormItemProps = Omit<BaseFormItemProps, "render" | "name"> & SelectProps;

const DistrictFormItem: React.FC<DistrictFormItemProps> = ({ ...props }) => {
    const { t } = useTranslation();

    const form = useFormContext();
    const [district, setDistrict] = React.useState<TAdministrativeUnit[]>([]);

    const getDistricts = async () => {
        const selectedProvinceCode = form.getValues("provinceCode");

        if (!selectedProvinceCode) {
            return;
        }

        try {
            const response = await getDistrictsByProvince(selectedProvinceCode);
            setDistrict(response.data.data);
        } catch (error) {
            console.error("Failed to fetch districts:", error);
        }
    };

    const handleChange = (event: SelectChangeEvent<unknown>) => {
        const selectedDistrict = event.target.value as string;
        const selected = district.find((p) => p.name === selectedDistrict);
        form.setValue("district", selectedDistrict);
        form.setValue("districtCode", selected?.code ?? "");
    };

    React.useEffect(() => {
        getDistricts();
    }, [form.watch("provinceCode")]);

    return (
        <FormItem
            name={"district"}
            label={t(i18n.translationKey.district)}
            render="select"
            options={toBaseOption<TAdministrativeUnit>(district, {
                label: "name_with_type",
                value: "name",
            })}
            onChange={handleChange}
            {...props}
        />
    );
};

export default DistrictFormItem;

import React from "react";
import FormItem from "../form-item";
import { TAdministrativeUnit } from "~/services/vn-public-api/types";
import { getAllProvinces } from "~/services/vn-public-api";
import { toBaseOption } from "../utils";
import { BaseFormItemProps } from "../types/form-item";
import { SelectChangeEvent, SelectProps } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";

type ProvinceFormItemProps = Omit<BaseFormItemProps, "render" | "name"> & SelectProps;

const ProvinceFormItem: React.FC<ProvinceFormItemProps> = ({ ...props }) => {
    const { t } = useTranslation();
    const { setValue } = useFormContext();
    const [province, setProvince] = React.useState<TAdministrativeUnit[]>([]);

    const getProvinces = async () => {
        try {
            const response = await getAllProvinces();
            setProvince(response.data.data);
        } catch (error) {
            console.error("Failed to fetch provinces:", error);
        }
    };

    const handleChange = (event: SelectChangeEvent<unknown>) => {
        const selectedProvince = event.target.value as string;
        const selected = province.find((p) => p.name === selectedProvince);
        setValue("province", selectedProvince);
        setValue("provinceCode", selected?.code ?? "");
    };

    React.useEffect(() => {
        getProvinces();
    }, []);

    return (
        <FormItem
            name="province"
            label={t(i18n.translationKey.province)}
            render="select"
            options={toBaseOption<TAdministrativeUnit>(province, {
                label: "name_with_type",
                value: "name",
            })}
            onChange={handleChange}
            {...props}
        />
    );
};

export default ProvinceFormItem;

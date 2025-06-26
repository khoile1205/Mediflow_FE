import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { getAllProvinces } from "~/services/vn-public-api";
import { TAdministrativeUnit } from "~/services/vn-public-api/types";
import FormItem from "../form-item";
import { AutocompleteFieldFormItemProps } from "../form-item/auto-complete";
import { toBaseOption } from "../utils";

type ProvinceFormItemProps = Omit<AutocompleteFieldFormItemProps, "render" | "name" | "options"> & {
    name?: string;
};

const ProvinceFormItem: React.FC<ProvinceFormItemProps> = ({ name = "province", ...props }) => {
    const { t } = useTranslation();
    const form = useFormContext();
    const [province, setProvince] = React.useState<TAdministrativeUnit[]>([]);
    const provinceFormValue = form.watch(name);

    const getProvinces = async () => {
        try {
            const response = await getAllProvinces();
            setProvince(response.data.data);
        } catch (error) {
            console.error("Failed to fetch provinces:", error);
        }
    };

    const handleChange = (_: React.SyntheticEvent<Element, Event>, value: string) => {
        const selected = province.find((p) => p.name_with_type == value);
        form.setValue(name, value);
        form.setValue("provinceCode", selected?.code ?? "");
    };

    React.useEffect(() => {
        getProvinces();
    }, []);

    React.useEffect(() => {
        if (provinceFormValue && province.length > 0) {
            const selected = province.find((p) => p.name === provinceFormValue);
            if (selected) {
                form.setValue("provinceCode", selected.code);
                form.setValue(name, selected.name);
            }
        }
    }, [provinceFormValue, province]);
    return (
        <FormItem
            name={name}
            label={t(i18n.translationKey.province)}
            render="autocomplete"
            options={toBaseOption<TAdministrativeUnit>(province, {
                label: "name_with_type",
                value: "name",
            })}
            onInputChange={handleChange}
            readOnly
            {...props}
        />
    );
};

export default ProvinceFormItem;

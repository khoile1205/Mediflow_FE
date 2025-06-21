import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { getDistrictsByProvince } from "~/services/vn-public-api";
import { TAdministrativeUnit } from "~/services/vn-public-api/types";
import FormItem from "../form-item";
import { AutocompleteFieldFormItemProps } from "../form-item/auto-complete";
import { toBaseOption } from "../utils";

type DistrictFormItemProps = Omit<AutocompleteFieldFormItemProps, "render" | "name" | "options"> & {
    name?: string;
};

const DistrictFormItem: React.FC<DistrictFormItemProps> = ({ ...props }) => {
    const { t } = useTranslation();

    const form = useFormContext();
    const [district, setDistrict] = React.useState<TAdministrativeUnit[]>([]);

    const getDistricts = async () => {
        const selectedProvinceCode = form.getValues("provinceCode");

        if (!selectedProvinceCode) {
            setDistrict([]);
            return;
        }

        try {
            const response = await getDistrictsByProvince(selectedProvinceCode);
            setDistrict(response.data.data);
        } catch (error) {
            console.error("Failed to fetch districts:", error);
        }
    };

    const handleChange = (_: React.SyntheticEvent<Element, Event>, value: string) => {
        const selected = district.find((p) => p.name_with_type === value);
        form.setValue(props.name ?? "district", value);
        form.setValue("districtCode", selected?.code ?? "");
    };

    React.useEffect(() => {
        getDistricts();
    }, [form.watch("provinceCode")]);

    return (
        <FormItem
            name={props.name ?? "district"}
            label={t(i18n.translationKey.district)}
            render="autocomplete"
            options={toBaseOption<TAdministrativeUnit>(district, {
                label: "name_with_type",
                value: "name",
            })}
            onInputChange={handleChange}
            {...props}
        />
    );
};

export default DistrictFormItem;

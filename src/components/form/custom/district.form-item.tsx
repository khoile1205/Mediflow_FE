import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { getDistrictsByProvince } from "~/services/vn-public-api";
import { TDistrict } from "~/services/vn-public-api/types";
import FormItem from "../form-item";
import { AutocompleteFieldFormItemProps } from "../form-item/auto-complete";
import { toBaseOption } from "../utils";

type DistrictFormItemProps = Omit<AutocompleteFieldFormItemProps, "render" | "name" | "options"> & {
    name?: string;
};

const DistrictFormItem: React.FC<DistrictFormItemProps> = ({ name = "district", ...props }) => {
    const { t } = useTranslation();
    const form = useFormContext();
    const [district, setDistrict] = React.useState<TDistrict[]>([]);
    const provinceCode = form.watch("provinceCode");
    const districtFormValue = form.watch(name);

    const getDistricts = async (code: string) => {
        if (!code) {
            setDistrict([]);
            return;
        }
        try {
            const response = await getDistrictsByProvince(code);
            setDistrict(response);
        } catch (error) {
            console.error("Failed to fetch districts:", error);
        }
    };

    const handleChange = (_: React.SyntheticEvent<Element, Event>, value: string) => {
        const selected = district.find((p) => p.name === value);
        form.setValue(name, value);
        form.setValue("districtCode", selected?.id ?? "");
    };

    React.useEffect(() => {
        if (provinceCode) {
            getDistricts(provinceCode);
        } else {
            setDistrict([]);
        }
    }, [provinceCode]);

    React.useEffect(() => {
        if (districtFormValue && district.length > 0) {
            const selected = district.find((d) => d.name === districtFormValue);
            if (selected) {
                form.setValue("districtCode", selected.id);
                form.setValue(name, selected.name);
            }
        }
    }, [districtFormValue, district]);

    return (
        <FormItem
            name={name}
            label={t(i18n.translationKey.district)}
            render="autocomplete"
            options={toBaseOption<TDistrict>(district, {
                label: "name",
                value: "name",
            })}
            onInputChange={handleChange}
            {...props}
        />
    );
};

export default DistrictFormItem;

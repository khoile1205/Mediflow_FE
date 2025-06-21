import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { getWardsByDistrict } from "~/services/vn-public-api";
import { TAdministrativeUnit } from "~/services/vn-public-api/types";
import FormItem from "../form-item";
import { AutocompleteFieldFormItemProps } from "../form-item/auto-complete";
import { toBaseOption } from "../utils";

type WardFormItemProps = Omit<AutocompleteFieldFormItemProps, "render" | "name" | "options"> & {
    name?: string;
};

const WardFormItem: React.FC<WardFormItemProps> = ({ ...props }) => {
    const { t } = useTranslation();

    const form = useFormContext();
    const [wards, setWards] = React.useState<TAdministrativeUnit[]>([]);

    const getWards = async () => {
        const selectedDistrict = form.watch("districtCode");

        if (!selectedDistrict) {
            setWards([]);
            return;
        }

        try {
            const response = await getWardsByDistrict(selectedDistrict);
            setWards(response.data.data ?? []);
        } catch (error) {
            console.error("Failed to fetch districts:", error);
        }
    };

    React.useEffect(() => {
        getWards();
    }, [form.watch("districtCode")]);

    return (
        <FormItem
            name={props.name ?? "ward"}
            label={t(i18n.translationKey.ward)}
            render="autocomplete"
            options={toBaseOption<TAdministrativeUnit>(wards, {
                label: "name_with_type",
                value: "name",
            })}
            {...props}
        />
    );
};

export default WardFormItem;

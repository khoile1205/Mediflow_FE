import { SearchOutlined } from "@mui/icons-material";
import { IconButton, TextField, TextFieldProps } from "@mui/material";
import React from "react";
import { useDebounce } from "~/hooks";

interface SearchBoxProps extends Omit<TextFieldProps, "onChange"> {
    onChange: (value: string) => void;
    delay?: number;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onChange, delay = 500, ...props }) => {
    const [searchValue, setSearchValue] = React.useState<string>("");
    const debouncedSearchValue = useDebounce(searchValue, delay);

    React.useEffect(() => {
        onChange(debouncedSearchValue);
    }, [debouncedSearchValue, onChange]);

    return (
        <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            slotProps={{
                input: {
                    endAdornment: (
                        <IconButton size="small" className="rounded-full">
                            <SearchOutlined />
                        </IconButton>
                    ),
                    size: "small",
                    className: "rounded-2xl bg-white",
                },
            }}
            {...props}
        />
    );
};

export default SearchBox;

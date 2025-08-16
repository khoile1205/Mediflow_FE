String.prototype.toCase = function (type: "camel" | "pascal" | "readable" = "camel"): string {
    const str = this.toString();

    if (!str) return "";

    // Split into words: handles PascalCase, camelCase, snake_case, kebab-case, etc.
    const words = str
        .replace(/([a-z])([A-Z])/g, "$1 $2") // split camel/Pascal boundaries
        .split(/[^a-zA-Z0-9]+/) // split by non-alphanumeric
        .filter(Boolean)
        .map((w) => w.toLowerCase());

    if (words.length === 0) return "";

    if (type === "readable") {
        // Capitalize each word
        return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }

    return words
        .map((word, i) => {
            if (i === 0 && type === "camel") {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join("");
};

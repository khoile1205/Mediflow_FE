export function formatCurrencyVND(amount: number): string {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export function numberToVietnamese(num: number): string {
    const ones = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    if (num === 0) return "Không";

    function readThreeDigits(n: number): string {
        const hundred = Math.floor(n / 100);
        const ten = Math.floor((n % 100) / 10);
        const unit = n % 10;
        const parts: string[] = [];

        if (hundred > 0) {
            parts.push(ones[hundred] + " trăm");
        }

        if (ten > 1) {
            parts.push(ones[ten] + " mươi");
            if (unit === 1) parts.push("mốt");
            else if (unit === 5) parts.push("lăm");
            else if (unit > 0) parts.push(ones[unit]);
        } else if (ten === 1) {
            parts.push("mười");
            if (unit === 5) parts.push("lăm");
            else if (unit > 0) parts.push(ones[unit]);
        } else if (ten === 0 && unit > 0) {
            if (hundred > 0) parts.push("lẻ");
            parts.push(ones[unit]);
        }

        return parts.join(" ");
    }

    const scales = ["", "nghìn", "triệu", "tỷ"];
    const words: string[] = [];
    let scaleIndex = 0;

    while (num > 0) {
        const chunk = num % 1000;
        if (chunk > 0) {
            let chunkWords = readThreeDigits(chunk);
            if (scales[scaleIndex]) {
                chunkWords += " " + scales[scaleIndex];
            }
            words.unshift(chunkWords);
        }
        num = Math.floor(num / 1000);
        scaleIndex++;
    }

    const result = words.join(" ").trim();
    return result.charAt(0).toUpperCase() + result.slice(1);
}

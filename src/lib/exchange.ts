const NBU_USD_RATE_URL = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json";

interface NbuRateResponse {
    rate?: number;
}

export async function getUsdToUahRate(revalidateSeconds = 3600): Promise<number | null> {
    try {
        const response = await fetch(NBU_USD_RATE_URL, {
            next: {revalidate: revalidateSeconds},
        });

        if (!response.ok) {
            return null;
        }

        const data = (await response.json()) as NbuRateResponse[];
        const rate = data?.[0]?.rate;

        if (typeof rate !== "number" || !Number.isFinite(rate)) return null;

        return rate;
    } catch {
        return null;
    }
}

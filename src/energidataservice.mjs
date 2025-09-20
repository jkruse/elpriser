export default async function getData(date, area) {
    const params = new URLSearchParams({
        start: date,
        end: new Date(Date.parse(date) + 24*60*60*1000).toISOString().substring(0, 10),
        columns: 'TimeDK,DayAheadPriceDKK',
        filter: JSON.stringify({ PriceArea: area }),
        sort: 'TimeDK'
    });
    const url = `https://api.energidataservice.dk/dataset/DayAheadPrices?${params}`;
    const raw = await fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Service returned status ${response.status} ${response.statusText}`);
        })
        .then(json => json.records)
        .catch(error => {
            console.log(error);
            return false;
        });
    if (!raw || raw.length === 0) {
        return false;
    }
    return raw.map(
        ({ TimeDK, DayAheadPriceDKK }) => ({
            TimeDK: TimeDK.substring(11, 16),
            Price: DayAheadPriceDKK / 1000.0 * 1.25
        })
    );
}

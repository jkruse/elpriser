let Chart = globalThis.Chart;
if (!Chart) {
    const { BarController, BarElement, CategoryScale, Chart: ChartJS, LinearScale, SubTitle, Title } = await import('chart.js');
    Chart = ChartJS;

    Chart.register([
        BarController,
        BarElement,
        CategoryScale,
        LinearScale,
        SubTitle,
        Title
    ]);
}

Chart.defaults.font.family = "'Liberation Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
Chart.defaults.font.size = 14;

const regions = {
    'DK1': 'vest for Storebælt',
    'DK2': 'øst for Storebælt'
};

const whiteBackground = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart) => {
        const { ctx } = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};

function format(number) {
    return number.toFixed(2).replace('.', ',');
}

let chart;

export default function drawChart(canvas, date, area, data) {
    const ctx = canvas.getContext('2d');

    const prices = data.map(val => val.Price);

    const backgroundColor = prices.map(
        price => {
            if (price < 1) {
                return 'rgba(0, 255, 0, 0.5)'
            }
            if (price < 2) {
                return 'rgba(240, 240, 0, 0.5)';
            }
            return 'rgba(255, 0, 0, 0.5)';
        }
    );
    const min = format(Math.min(...prices));
    const max = format(Math.max(...prices));
    const avg = format(prices.reduce((a, b) => a + b, 0) / prices.length);

    chart?.destroy();

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                //label: ,
                data,
                backgroundColor
            }]
        },
        options: {
            responsive: false,
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            layout: {
                padding: {
                    right: 10
                }
            },
            parsing: {
                xAxisKey: 'TimeDK',
                yAxisKey: 'Price'
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        drawOnChartArea: false,
                        offset: false
                    }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: 5,
                    ticks: {
                        callback: format
                    },
                    title: {
                        display: true,
                        text: 'DKK'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: `Elpriser for ${date} (${regions[area]}, uden afgifter)`,
                    font: {
                        weight: 'bold',
                        size: 16
                    }
                },
                subtitle: {
                    display: true,
                    text: `min: ${min} / max: ${max} / gns: ${avg}`,
                    padding: {
                        top: 0,
                        bottom: 10
                    }
                }
            }
        },
        plugins: [whiteBackground]
    });
}

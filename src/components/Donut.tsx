import React, { useEffect, useRef, useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Legend,
    ChartArea,
    ChartData,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
    const gradient = ctx.createConicGradient(4.7124, 35, 35);

    gradient.addColorStop(0, 'white');

    gradient.addColorStop(1, 'green');

    return gradient;
}

function Donut({ exp }: { exp: number }) {
    ChartJS.register(ArcElement);
    const chartRef = useRef<any>(null);
    const [chartData, setChartData] = useState<ChartData<'doughnut'>>({
        datasets: [],
    });

    useEffect(() => {
        const chart = chartRef.current;

        if (!chart) {
            return;
        }
        const data = {
            datasets: [
                {
                    data: [exp, 100 - exp],
                    backgroundColor: [
                        createGradient(chart.ctx, chart.chartArea),
                        'rgba(255, 255, 255, 0)',
                    ],
                    borderWidth: 0,
                    cutout: 28,
                },
            ],
        };

        setChartData(data);
    }, [exp]);

    return <Doughnut data={chartData} ref={chartRef} />;
}
export default Donut;

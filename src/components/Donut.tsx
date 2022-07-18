import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

function Donut({ exp }: { exp: number }) {
    ChartJS.register(ArcElement, Legend);
    const data = {
        datasets: [
            {
                data: [exp, 100 - exp],
                backgroundColor: [`#30e06b`, 'rgba(255, 255, 255, 0)'],
                borderWidth: 0,
                cutout: 28,
                hoverBorderJoinStyle: 100,
            },
        ],
    };
    return <Doughnut data={data} />;
}
export default Donut;

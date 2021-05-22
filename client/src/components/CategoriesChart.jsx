import React from 'react';
import PropTypes from 'prop-types';

// import {
//   Chart,
//   LinearScale,
//   TimeScale,
//   TimeSeriesScale,
//   Decimation,
//   Filler,
//   Legend,
//   Title,
//   Tooltip,
//   Doughnut,
// } from 'chart.js';

// Chart.register(
//   LinearScale,
//   TimeScale,
//   TimeSeriesScale,
//   Decimation,
//   Filler,
//   Legend,
//   Title,
//   Tooltip,
//   Doughnut
// );

import { Doughnut } from 'react-chartjs-2';
// import 'chartjs-plugin-datalabels';

CategoriesChart.propTypes = {
  categories: PropTypes.object,
};

export default function CategoriesChart({ categories }) {
  const labels = Object.keys(categories);
  const data = Object.values(categories);
  const state = {
    labels: labels,
    datasets: [
      {
        options: {
          legend: {
            display: true,
          },
          plugins: {
            datalabels: {
              display: true,
              color: 'white',
              backgroundColor: '#404040',
            },
          },
        },
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
      },
    ],
  };

  return (
    <div className="chartContainer">
      The doughnut is right below me
      <Doughnut
        data={state}
        options={{
          title: {
            display: true,
            text: 'My doughnut chart',
          },
          legend: {
            display: true,
            position: 'right',
          },
        }}
      />
    </div>
  );
}

import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import colors from 'plaid-threads/scss/colors.ts';

CategoriesChart.propTypes = {
  categories: PropTypes.object,
};

export default function CategoriesChart({ categories }) {
  const data = [];
  const labels = Object.keys(categories);
  const values = Object.values(categories);
  for (let i = 0; i < labels.length; i++) {
    data.push({ name: labels[i], value: Math.round(values[i]) });
  }

  // threads colors (TO DO:  USE THREADS VARIABLE NAMES!!!)
  const COLORS = [
    colors.yellow900,
    colors.green900,
    colors.blue900,
    colors.red900,
  ];

  return (
    <div className="holdingsList">
      <h4 className="tableHeading">Spending Categories</h4>
      <PieChart width={400} height={400}>
        <Legend />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          isAnimationActive={false}
          paddingAngle={5}
          label
          innerRadius={70}
          outerRadius={90}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              label={true}
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}

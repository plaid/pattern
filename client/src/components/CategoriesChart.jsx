import React from 'react';
import PropTypes from 'prop-types';

import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

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

  // threads colors
  const COLORS = ['#0868b8', '#2ab589', '#d9bc2d', '#d44648'];

  return (
    <div>
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
          fill="#8884d8"
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

import React from 'react';
import PropTypes from 'prop-types';

import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

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

  const renderCustomLabel = item => (
    <text
      fill={item.fill}
      x={item.x}
      y={item.y}
      stroke="none"
      alignmentBaseline="middle"
      className="recharts-text recharts-pie-label-text"
      textAnchor="end"
    >
      <tspan x={item.x} textAnchor={item.textAnchor} dy="0em">
        {item.name}
      </tspan>
    </text>
  );

  console.log(data);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <h4>Monthly Spending Categories Summary</h4>
      <PieChart width={400} height={400}>
        <Legend />

        <Pie
          data={data}
          cx="50%"
          cy="50%"
          isAnimationActive={false}
          // paddingAngle={5}
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
        <Tooltip />
      </PieChart>
    </div>
  );
}

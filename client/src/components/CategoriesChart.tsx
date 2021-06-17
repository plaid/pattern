import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import colors from 'plaid-threads/scss/colors';

interface Props {
  categories: {
    [key: string]: number;
  };
}

export default function CategoriesChart(props: Props) {
  const data = [];
  const labels = Object.keys(props.categories);
  const values = Object.values(props.categories);
  for (let i = 0; i < labels.length; i++) {
    data.push({ name: labels[i], value: Math.round(values[i]) });
  }

  const COLORS = [
    colors.blue900,
    colors.green900,
    colors.yellow900,
    colors.red900,
  ];

  return (
    <div className="holdingsList">
      <h4 className="holdingsHeading">Spending Categories</h4>
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}

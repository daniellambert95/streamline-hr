import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
  { skill: 'Technical', score: 4.5, fullMark: 5 },
  { skill: 'Communication', score: 4.2, fullMark: 5 },
  { skill: 'Leadership', score: 3.8, fullMark: 5 },
  { skill: 'Innovation', score: 4.0, fullMark: 5 },
  { skill: 'Teamwork', score: 4.7, fullMark: 5 },
  { skill: 'Delivery', score: 4.3, fullMark: 5 },
];

export const SkillsMatrix: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Skills Assessment</h3>
        <select className="px-3 py-1.5 text-sm border rounded-lg">
          <option>Team Average</option>
          <option>Individual View</option>
        </select>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            <Radar
              name="Skills"
              dataKey="score"
              stroke="#6366F1"
              fill="#6366F1"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function ArtistGraph({ graphData, artistName, currWeek }) {
    if (!graphData) {
        return null;
    }
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h3>{`CHART POINTS TREND: ${artistName}`}</h3>
        <ResponsiveContainer width="50%" height={400}>
          <LineChart data={graphData} margin={{ top: 5, right: 100, left: 40, bottom: 20 }}>
            <CartesianGrid stroke="#000000" strokeDasharray="3 3" />
            <XAxis dataKey="weekIndex" domain={['dataMin', 'dataMax']} padding={{ left: 10, right: 10 }} label={{ value: 'Week # (1 is June 26, 2017)', position: 'bottom', offset: 4, fill: '#000000' }} tick={{ fill: '#000000' }} />
            <YAxis label={{ value: 'Chart Points', angle: -90, position: 'insideLeft', offset: -4, fill: '#000000' }} tick={{ fill: '#000000' }} />
            <Tooltip />
            <Line type="monotone" dataKey="Points" stroke="#3d405b"  strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
}

export default ArtistGraph;
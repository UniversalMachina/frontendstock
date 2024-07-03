import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ReferenceLine, Scatter } from 'recharts';

const examplePatterns = [
  "Ascending Triangle", 
  "Descending Triangle", 
  "Double Top", 
  "Double Bottom", 
  "Head and Shoulders",
  "Inverse Head and Shoulders",
  "Rising Wedge",
  "Falling Wedge",
  "Bullish Flag",
  "Bearish Flag"
];

const StockDashboard = () => {
  const [patterns, setPatterns] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [newPattern, setNewPattern] = useState('');
  const [newStock, setNewStock] = useState('');
  const [simulationResults, setSimulationResults] = useState(null);

  useEffect(() => {
    fetchPatterns();
    fetchStocks();
  }, []);

  const fetchPatterns = async () => {
    const response = await axios.get('http://localhost:5000/patterns');
    setPatterns(response.data);
  };

  const fetchStocks = async () => {
    const response = await axios.get('http://localhost:5000/stocks');
    setStocks(response.data);
  };

  const addPattern = async () => {
    await axios.post('http://localhost:5000/patterns', { pattern: newPattern });
    setNewPattern('');
    fetchPatterns();
  };

  const removePattern = async (pattern) => {
    await axios.delete('http://localhost:5000/patterns', { data: { pattern } });
    fetchPatterns();
  };

  const addStock = async () => {
    await axios.post('http://localhost:5000/stocks', { stock: newStock });
    setNewStock('');
    fetchStocks();
  };

  const removeStock = async (stock) => {
    await axios.delete('http://localhost:5000/stocks', { data: { stock } });
    fetchStocks();
  };

  const startSimulation = async () => {
    const response = await axios.post('http://localhost:5000/simulate');
    setSimulationResults(response.data);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 border">
          <p className="label">{`Date : ${label}`}</p>
          <p className="intro">{`Price : $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 flex">
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-2xl font-semibold mb-4">Trading Patterns</h2>
        <ul className="list-disc pl-5 mb-4">
          {patterns.map((pattern, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              {pattern}
              <button onClick={() => removePattern(pattern)} className="text-red-500 ml-2">Remove</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newPattern}
          onChange={(e) => setNewPattern(e.target.value)}
          placeholder="New pattern"
          className="border p-2 w-full mb-2"
        />
        <button onClick={addPattern} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Add Pattern</button>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Example Patterns</h3>
          <ul className="list-disc pl-5">
            {examplePatterns.map((example, index) => (
              <li key={index} className="mb-1">{example}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-3/4 p-4">
        <h1 className="text-3xl font-bold mb-4">Stock Trading Simulator</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Stocks to Trade</h2>
          <ul className="list-disc pl-5 mb-2">
            {stocks.map((stock, index) => (
              <li key={index} className="flex justify-between items-center">
                {stock}
                <button onClick={() => removeStock(stock)} className="text-red-500 ml-2">Remove</button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            placeholder="New stock symbol"
            className="border p-2 mr-2"
          />
          <button onClick={addStock} className="bg-blue-500 text-white px-4 py-2 rounded">Add Stock</button>
        </div>

        <button onClick={startSimulation} className="bg-green-500 text-white px-6 py-3 rounded text-lg">Start Simulation</button>

        {simulationResults && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Simulation Results</h2>
            {Object.entries(simulationResults).map(([stock, data]) => (
              <div key={stock} className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{stock}</h3>
                <p>Performance: {data.performance.toFixed(2)}%</p>
                <LineChart width={800} height={400} data={data.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="Close" stroke="#8884d8" />
                  <Brush dataKey="Date" height={30} stroke="#8884d8" />
                  {data.actions.map((action, index) => (
                    <ReferenceLine
                      key={index}
                      x={action.date}
                      stroke={action.action === 'buy' ? '#4CAF50' : '#F44336'}
                      label={{ value: action.action, position: 'top' }}
                    />
                  ))}
                  {data.patterns.map((pattern, index) => (
                    <React.Fragment key={index}>
                      <ReferenceLine
                        x={pattern.date}
                        stroke="#FFD700"
                        label={{ value: pattern.pattern, position: 'top', fill: '#FFD700' }}
                      />
                      <Scatter
                        data={[{ x: pattern.coordinates[0][0], y: pattern.coordinates[0][1] }, { x: pattern.coordinates[1][0], y: pattern.coordinates[1][1] }, { x: pattern.coordinates[2][0], y: pattern.coordinates[2][1] }]}
                        fill="#FFD700"
                        line={{ strokeWidth: 2, stroke: "#FFD700" }}
                        shape="triangle"
                      />
                    </React.Fragment>
                  ))}
                </LineChart>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDashboard;

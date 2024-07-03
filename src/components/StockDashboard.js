import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const StockDashboard = () => {
  const [patterns, setPatterns] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [newPattern, setNewPattern] = useState('');
  const [newStock, setNewStock] = useState('');
  const [simulationResults, setSimulationResults] = useState(null);
  const [selectedPatterns, setSelectedPatterns] = useState([]);

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
    const response = await axios.post('http://localhost:5000/simulate', { patterns: selectedPatterns });
    setSimulationResults(response.data);
  };

  const togglePatternSelection = (pattern) => {
    setSelectedPatterns(prevSelected => 
      prevSelected.includes(pattern)
        ? prevSelected.filter(p => p !== pattern)
        : [...prevSelected, pattern]
    );
  };

  return (
    <div className="container mx-auto p-4 flex">
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-2xl font-semibold mb-4">Trading Patterns</h2>
        <ul className="list-disc pl-5 mb-4">
          {patterns.map((pattern, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <label>
                <input
                  type="checkbox"
                  checked={selectedPatterns.includes(pattern)}
                  onChange={() => togglePatternSelection(pattern)}
                  className="mr-2"
                />
                {pattern}
              </label>
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
                <p>Overall Performance: {data.performance.toFixed(2)}%</p>
                <Plot
                  data={[
                    {
                      x: data.data.map(d => d.Date),
                      y: data.data.map(d => d.Close),
                      type: 'scatter',
                      mode: 'lines',
                      name: 'Close Price',
                    },
                    ...data.patterns.map(pattern => ({
                      x: [pattern.start.date, pattern.end.date],
                      y: [pattern.start.price, pattern.end.price],
                      type: 'scatter',
                      mode: 'lines',
                      name: `${pattern.name} (${pattern.performance > 0 ? 'Profit' : 'Loss'})`,
                      line: {
                        color: pattern.performance > 0 ? 'green' : 'red',
                        width: 3,
                      },
                    })),
                  ]}
                  layout={{
                    title: `${stock} Stock Price and Patterns`,
                    xaxis: { title: 'Date' },
                    yaxis: { title: 'Price' },
                    showlegend: true,
                  }}
                  config={{ responsive: true }}
                />
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Pattern Performance:</h4>
                  <ul>
                    {data.patterns.map((pattern, index) => (
                      <li key={index} className={pattern.performance > 0 ? 'text-green-600' : 'text-red-600'}>
                        {pattern.name}: {pattern.performance.toFixed(2)}%
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDashboard;
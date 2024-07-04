import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TradesList = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchTrades = async () => {
      const result = await axios.get('http://localhost:5000/trades');
      setTrades(result.data);
    };
    fetchTrades();
  }, []);

  return (
    <div>
      <h2>Trades</h2>
      <ul>
        {trades.map((trade, index) => (
          <li key={index}>
            {trade.date}: {trade.trade_type} {trade.quantity} shares of {trade.stock_symbol} at ${trade.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradesList;

import React, { useState } from 'react';
import StockChart from './StockChart';
import TradeForm from './TradeForm';
import TradesList from './TradesList';

const App = () => {
  const [trades, setTrades] = useState([]);

  const handleNewTrade = (trade) => {
    setTrades([...trades, trade]);
  };

  return (
    <div>
      <h1>Stock Trading Simulator</h1>
      <StockChart symbol="AAPL" />
      <TradeForm onTrade={handleNewTrade} />
      <TradesList trades={trades} />
    </div>
  );
};

export default App;

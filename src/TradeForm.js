import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Select, MenuItem, Button } from '@mui/material';

const TradeForm = ({ onTrade }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    stock_symbol: '',
    trade_type: 'buy',
    quantity: '',
    price: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await axios.post('http://localhost:5000/trade', formData);
    onTrade(result.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField name="user_id" value={formData.user_id} onChange={handleChange} label="User ID" />
      <TextField name="stock_symbol" value={formData.stock_symbol} onChange={handleChange} label="Stock Symbol" />
      <Select name="trade_type" value={formData.trade_type} onChange={handleChange}>
        <MenuItem value="buy">Buy</MenuItem>
        <MenuItem value="sell">Sell</MenuItem>
        <MenuItem value="short">Short</MenuItem>
      </Select>
      <TextField name="quantity" value={formData.quantity} onChange={handleChange} label="Quantity" />
      <TextField name="price" value={formData.price} onChange={handleChange} label="Price" />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default TradeForm;

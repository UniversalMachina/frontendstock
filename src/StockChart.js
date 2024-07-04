import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  XAxis,
  YAxis,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  OHLCTooltip,
  discontinuousTimeScaleProviderBuilder
} from 'react-financial-charts';

const StockChart = ({ symbol }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:5000/stock/${symbol}`);
        const stockData = result.data;

        // Ensure stockData is an array
        if (Array.isArray(stockData)) {
          // Validate the structure of the data
          const isValidData = stockData.every(item => 
            item.date && item.open && item.high && item.low && item.close
          );

          if (isValidData) {
            setData(stockData);
          } else {
            console.error("Invalid data structure", stockData);
          }
        } else {
          console.error("Data is not an array", stockData);
        }
      } catch (error) {
        console.error("Error fetching stock data", error);
      }
    };
    fetchData();
  }, [symbol]);

  if (data.length === 0) return <div>Loading...</div>;

  const scaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(d => new Date(d.date));
  const { data: chartData, xScale, xAccessor, displayXAccessor } = scaleProvider(data);

  return (
    <ChartCanvas 
      height={400} 
      ratio={1} 
      width={600} 
      margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
      seriesName="MSFT"
      data={chartData}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
    >
      <Chart id={1} yExtents={d => [d.high, d.low]}>
        <XAxis />
        <YAxis />
        <CandlestickSeries />
        <MouseCoordinateX />
        <MouseCoordinateY />
        <OHLCTooltip origin={[-40, 0]} />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default StockChart;
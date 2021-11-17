import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

export default function Graph(props) {
  const [priceData, setPriceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState(null);

  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  const [moedaCorrente, setMoedaCorrente] = useState("USD");

  function handleChange() {
    if (!dataInicial || !dataFinal) {
      return null;
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleChange();

    axios
      .get(
        `http://api.coindesk.com/v1/bpi/historical/close.json?start=${dataInicial}&end=${dataFinal}&currency=${moedaCorrente}`
      )
      .then((response) => {
        setPriceData({ ...response.data.bpi });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dataInicial, dataFinal, moedaCorrente]);

  useEffect(() => {
    if (!loading) {
      const renderChart = () => {
        const ctx = document.getElementById("myCanvas").getContext("2d");

        if (chart) {
          chart.destroy();
        }

        const chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: Object.keys(priceData), // Array com as datas
            datasets: [
              {
                label: "Histórico de preços BTC",
                data: Object.values(priceData).map(
                  (currentPriceObj) => currentPriceObj
                ), // Array com os preços de fechamento
                borderColor: "#0330fc",
                backgroundColor: "#03b1fc",
                fill: false,
              },
            ],
          },
        });

        setChart(chartInstance);
      };

      renderChart();
    }
  }, [setChart, loading, priceData]);

  const handleInitialDate = (event) => {
    setDataInicial(event.target.value);
  };

  const handleFinalDate = (event) => {
    setDataFinal(event.target.value);
  };

  const handleMoeda = (event) => {
    setMoedaCorrente(event.target.value);
  };

  return (
    <div>
      <div>
        <span>De: </span>{" "}
        <input name="dataInicial" onChange={handleInitialDate} type="date" />
        <span>Até: </span>{" "}
        <input name="dataFinal" onChange={handleFinalDate} type="date" />
        <select onChange={handleMoeda}>
          <option>USD</option>
          <option>EUR</option>
        </select>
      </div>
      {loading ? "Carregando..." : <canvas id="myCanvas" />}
    </div>
  );
}
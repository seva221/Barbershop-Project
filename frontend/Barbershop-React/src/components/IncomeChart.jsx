import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

function IncomeChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Income (₪)",
        data: [5000, 6200, 4800, 7000, 6500],
      },
    ],
  };

  return <Bar data={data} />;
}

export default IncomeChart;

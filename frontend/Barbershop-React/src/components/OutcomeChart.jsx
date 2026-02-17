import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

function OutcomeChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Outcome (₪)",
        data: [2000, 2500, 1800, 3000, 2200],
      },
    ],
  };

  return <Bar data={data} />;
}

export default OutcomeChart;

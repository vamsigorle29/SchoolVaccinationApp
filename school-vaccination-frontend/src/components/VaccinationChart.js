import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const VaccinationChart = ({ vaccinated, unvaccinated }) => {
  const total = vaccinated + unvaccinated;
  const vaccinatedPercentage = Math.round((vaccinated / total) * 100) || 0;
  const unvaccinatedPercentage = Math.round((unvaccinated / total) * 100) || 0;

  const data = {
    labels: ["Vaccinated", "Unvaccinated"],
    datasets: [
      {
        data: [vaccinated, unvaccinated],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // success
          "rgba(239, 68, 68, 0.8)", // destructive
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 15,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const percentage = context.dataset.data[context.dataIndex] / total * 100;
            return `${label}: ${value} (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
    cutout: "70%",
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Vaccination Rate
          </p>
          <p className="text-4xl font-bold text-primary mt-1">
            {vaccinatedPercentage}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            of total students
          </p>
        </div>
      </div>
      <Pie data={data} options={options} />
    </div>
  );
};

export default VaccinationChart;

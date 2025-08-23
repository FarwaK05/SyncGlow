// src/pages/History.jsx

import React, { useEffect, useState } from 'react';
import { getUserAnalyses } from '../services/supabaseClient';
import Card from '../components/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Helper array to define which conditions to track on the chart
const conditionsToTrack = [
  { key: 'acne', label: 'Acne', color: 'rgb(239, 68, 68)' },
  { key: 'skin_spot', label: 'Skin Spots', color: 'rgb(249, 115, 22)' },
  { key: 'blackhead', label: 'Blackheads', color: 'rgb(55, 65, 81)' },
  { key: 'dark_circle', label: 'Dark Circles', color: 'rgb(107, 33, 168)' },
  { key: 'mole', label: 'Moles', color: 'rgb(139, 92, 246)' }
];

const History = ({ user }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) { loadAnalyses(); }
  }, [user]);

  const loadAnalyses = async () => {
    setLoading(true);
    const { data, error } = await getUserAnalyses(user.id);
    if (error) {
      setError('Failed to load analysis history');
    } else {
      // Reverse the data so the chart shows oldest to newest (left to right)
      setAnalyses((data || []).reverse()); 
    }
    setLoading(false);
  };

  const formatDate = (dateString, options = {}) => {
    const defaultOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', { ...defaultOptions, ...options });
  };

  // Dynamically build the chart datasets from our helper array
  const chartData = {
    labels: analyses.map(a => formatDate(a.created_at)),
    datasets: conditionsToTrack.map(condition => ({
      label: `${condition.label} Confidence`,
      data: analyses.map(a => a.full_result?.[condition.key]?.confidence * 100 || 0),
      borderColor: condition.color,
      backgroundColor: `${condition.color.slice(0, -1)}, 0.5)`, // Make color semi-transparent
      tension: 0.2,
      pointRadius: 4,
      pointBackgroundColor: condition.color,
      hidden: !['acne', 'skin_spot'].includes(condition.key) // Initially hide less common lines
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: 'top',
        labels: { usePointStyle: true, padding: 20 }
      },
      title: { display: true, text: 'Skin Condition Confidence Over Time (%)', font: { size: 18 } },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed.y !== null) { label += context.parsed.y.toFixed(1) + '%'; }
            return label;
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true, max: 100, title: { display: true, text: 'Confidence (%)' } }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your analysis history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gradient-daylight min-h-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 animate-on-load">Analysis History</h1>
          <p className="text-lg text-gray-600 mt-2 animate-on-load" style={{ animationDelay: '150ms' }}>
            Track your skin analysis results and progress over time.
          </p>
        </div>

        {error && <Card className="mb-8 bg-red-50 border-red-200 text-red-700"><p>{error}</p></Card>}

        {analyses.length < 2 ? (
          <Card className="animate-on-load" style={{ animationDelay: '300ms' }}>
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Enough Data for a Graph</h3>
              <p className="text-gray-600 mb-4">Perform at least two analyses to see your progress over time.</p>
            </div>
          </Card>
        ) : (
          <Card className="animate-on-load card-hover" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Progress</h2>
            <p className="text-sm text-gray-600 mb-6">Click on the labels above the chart to show or hide different trend lines.</p>
            <Line options={chartOptions} data={chartData} />
          </Card>
        )}

        <Card className="mt-8 animate-on-load" style={{ animationDelay: '450ms' }}>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Detailed History</h2>
          {analyses.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-500">You haven't performed any skin analyses yet.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date & Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {[...analyses].reverse().map((analysis) => (
                    <tr key={analysis.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-4 px-4 text-sm text-gray-600 font-medium">{formatDate(analysis.created_at, { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-4 px-4 text-gray-800">{analysis.result_summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default History;
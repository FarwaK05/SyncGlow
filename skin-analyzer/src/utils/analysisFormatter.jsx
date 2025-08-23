import React from 'react';

/**
 * Takes the raw JSON from the Perfect Corp API and transforms it into readable JSX.
 * By placing this in a separate file, both the analyzer and history pages can use the same logic.
 * 
 * IMPORTANT: You may need to adjust the keys (e.g., `data.face_analysis_result`, `results.spots`)
 * to match the exact structure of the API response you receive.
 */
export const formatAnalysisResults = (data) => {
  // Safely access the main results object using optional chaining (?.)
  const results = data?.face_analysis_result;

  if (!results) {
    return (
      <p className="text-sm text-gray-600">
        Could not parse the analysis results. The data format might be unexpected.
      </p>
    );
  }

  // Build a list of all detected skin concerns
  const findings = [];
  if (results.spots) findings.push({ label: 'Spots', value: `${results.spots.count} detected (Score: ${results.spots.score})` });
  if (results.wrinkles) findings.push({ label: 'Wrinkles', value: `Score: ${results.wrinkles.score}` });
  if (results.texture) findings.push({ label: 'Texture', value: `Score: ${results.texture.score}` });
  if (results.dark_circle) findings.push({ label: 'Dark Circles', value: `Score: ${results.dark_circle.score}` });
  if (results.moisture) findings.push({ label: 'Moisture', value: `Score: ${results.moisture.score}` });
  if (results.oiliness) findings.push({ label: 'Oiliness', value: `Score: ${results.oiliness.score}` });
  if (results.redness) findings.push({ label: 'Redness', value: `Score: ${results.redness.score}` });
  // Add other metrics from the API response here...

  if (findings.length === 0) {
    return <p className="text-sm text-gray-600">No specific skin concerns were detected in the analysis.</p>;
  }

  // Render the findings in a clean list
  return (
    <div className="space-y-2">
      {findings.map((finding) => (
        <div key={finding.label} className="flex justify-between items-center text-sm">
          <span className="font-semibold text-gray-800">{finding.label}:</span>
          <span className="text-gray-600">{finding.value}</span>
        </div>
      ))}
    </div>
  );
};
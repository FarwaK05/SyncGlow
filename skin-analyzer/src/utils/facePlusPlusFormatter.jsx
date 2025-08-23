import React from 'react';

// Helper maps for Face++ data
const severityMap = { 0: 'None', 1: 'Mild', 2: 'Moderate', 3: 'Severe' };
const skinTypeMap = { 0: 'Normal', 1: 'Oily', 2: 'Dry', 3: 'Mixed' };

export const formatFacePlusPlusResults = (data) => {
  // --- NEW BILINGUAL LOGIC ---

  // 1. Check if it's new Face++ data (it will have a 'result' property)
  if (data?.result) {
    const results = data.result;
    const findings = [];
    
    if (results.skin_type) findings.push({ label: 'Skin Type', value: skinTypeMap[results.skin_type.skin_type] || 'Unknown' });
    if (results.acne) findings.push({ label: 'Acne', value: severityMap[results.acne.value] || 'Unknown' });
    if (results.dark_circle) findings.push({ label: 'Dark Circles', value: severityMap[results.dark_circle.value] || 'Unknown' });
    if (results.skin_spot) findings.push({ label: 'Skin Spots', value: severityMap[results.skin_spot.value] || 'Unknown' });
    if (results.mole) findings.push({ label: 'Moles', value: severityMap[results.mole.value] || 'Unknown' });
    if (results.blackhead) findings.push({ label: 'Blackheads', value: severityMap[results.blackhead.value] || 'Unknown' });

    if (findings.length === 0) {
      return <p className="text-sm text-gray-600">No specific skin concerns were detected.</p>;
    }

    return (
      <div className="space-y-2 mt-2">
        {findings.map((finding) => (
          <div key={finding.label} className="flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-800">{finding.label}:</span>
            <span className="text-gray-600 font-medium">{finding.value}</span>
          </div>
        ))}
      </div>
    );
  }

  // 2. If not, assume it's old, invalid data and show a clear message.
  return (
    <p className="text-sm text-gray-400 italic">
      [Old analysis data from a previous API - cannot be displayed]
    </p>
  );
};
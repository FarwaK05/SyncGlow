// src/pages/SkinAnalyzer.jsx

import React, { useState } from 'react';
import { saveAnalysis } from '../services/supabaseClient';
import Card from '../components/Card';
import Button from '../components/Button';

const skinTypeMap = { 0: 'Normal', 1: 'Dry', 2: 'Oily', 3: 'Combination' };

const AnalysisDetails = ({ result }) => {
  if (!result || !result.result) return null;
  const analysisData = result.result;
  const skinTypeNumber = analysisData.skin_type?.skin_type;
  const skinTypeName = skinTypeMap[skinTypeNumber] || 'Unknown';
  const attributes = Object.keys(analysisData)
    .filter(key => key !== 'skin_type' && analysisData[key])
    .map(key => ({ name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), ...analysisData[key] }));

  return (
    <div className="animate-on-load">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Analysis Summary</h3>
        <p className="text-green-700 font-medium">Detected Skin Type: <span className="font-bold">{skinTypeName}</span></p>
      </div>
      <h4 className="font-semibold text-gray-800 mb-3">Detailed Breakdown:</h4>
      <div className="space-y-3">
        {attributes.map(attr => (
          <div key={attr.name} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">{attr.name}</span>
              <span className={`font-bold text-sm px-2 py-1 rounded-full ${attr.value === 1 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>{attr.value === 1 ? 'Detected' : 'Not Detected'}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Confidence: {(attr.confidence * 100).toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkinAnalyzer = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); setError(''); setAnalysisResult(null);
      } else {
        setError('Please select a valid image file'); setSelectedFile(null); setPreviewUrl('');
      }
    }
  };

  // --- THIS IS THE UPDATED FUNCTION ---
  const createSummaryFromResult = (result) => {
    if (!result || !result.result) return "Analysis complete.";

    const data = result.result;
    const skinTypeName = skinTypeMap[data.skin_type?.skin_type] || 'Unknown';
    
    let summaryParts = [`Skin Type: ${skinTypeName}`];

    // A list of conditions to check for
    const conditionsToCheck = {
      acne: "Acne",
      skin_spot: "Skin Spots",
      blackhead: "Blackheads",
      mole: "Moles",
      dark_circle: "Dark Circles"
    };

    // Loop through the conditions and add them to the summary if their value is 1 (detected)
    for (const key in conditionsToCheck) {
      if (data[key]?.value === 1) {
        summaryParts.push(`${conditionsToCheck[key]} Detected`);
      }
    }

    // If only the skin type was found, return a simple message. Otherwise, join all parts.
    if (summaryParts.length === 1) {
      return `Skin Type: ${skinTypeName}. No other major conditions detected.`;
    }

    return summaryParts.join(', ') + '.';
  };

  const handleAnalyze = async () => {
    if (!selectedFile) { setError('Please select an image first'); return; }
    setAnalyzing(true); setError(''); setAnalysisResult(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/analyze-skin/', { method: 'POST', body: formData });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed due to a server error.');
      }
      const resultData = await response.json();
      setAnalysisResult(resultData);
      const summary = createSummaryFromResult(resultData);
      const { error: saveError } = await saveAnalysis(user.id, summary, resultData.result);
      if (saveError) {
        console.error('Error saving analysis:', saveError);
        setError(`Analysis successful, but failed to save to history: ${saveError.message}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null); setPreviewUrl(''); setAnalysisResult(null); setError('');
    document.getElementById('fileInput').value = '';
  };

  return (
    <div className="bg-gradient-daylight min-h-full">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm-px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 animate-on-load">
              Skin Analyzer
            </h1>
            <p className="text-lg text-gray-600 animate-on-load" style={{ animationDelay: '150ms' }}>
              Upload a clear photo of your skin for AI-powered analysis
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="card-hover animate-on-load" style={{ animationDelay: '300ms' }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Image</h2>
              
              <div className="mb-6">
                <label htmlFor="fileInput" className="cursor-pointer block w-full text-center px-6 py-10 border-2 border-dashed border-thistle rounded-lg hover:border-cool-gray hover:bg-pale-purple/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-thistle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="mt-2 block text-sm font-medium text-cool-gray">
                    {selectedFile ? selectedFile.name : 'Click to choose a file'}
                  </span>
                </label>
                <input id="fileInput" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>

              {previewUrl && (
                <div className="mb-6 animate-on-load"><img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain rounded-lg border border-gray-200" /></div>
              )}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAnalyze}
                  loading={analyzing}
                  disabled={!selectedFile || analyzing}
                  className="w-full bg-gradient-aurora text-white font-bold py-3 btn-animate btn-gradient-shimmer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Skin'}
                </Button>
                
                {selectedFile && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={analyzing}
                    className="w-full sm:w-auto px-6 py-3 font-semibold text-cool-gray bg-transparent border-2 border-thistle hover:bg-thistle/20 hover:border-cool-gray btn-animate"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </Card>

            <Card className="card-hover animate-on-load" style={{ animationDelay: '450ms' }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Analysis Results</h2>
              {analyzing ? (
                <div className="text-center py-12">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your skin image...</p>
                </div>
              ) : analysisResult ? (
                <AnalysisDetails result={analysisResult} />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-800">Your results will appear here</h3>
                  <p className="mt-1 text-sm text-gray-500">Upload an image to begin.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinAnalyzer;
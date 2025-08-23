import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient'; // Make sure you export 'supabase' from your client
import Card from '../components/Card';

const Analyzer = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setAnalysisResult(null); // Reset previous result
    setError('');
  };

  // This function creates a user-friendly summary from the API response
  const createSummaryFromResult = (result) => {
    if (!result || !result.result || !result.result.skin_type) {
      return "Analysis complete. Detailed results available.";
    }
    const { acne, dark_circle, skin_spot, mole, blackhead, skin_type } = result.result;
    
    // Example summary: "Skin Type: Oily, Acne: 3 spots, Blackheads: 8 spots."
    return `Skin Type: ${skin_type.value}, Acne: ${acne.length} spots, Blackheads: ${blackhead.length} spots.`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }
    if (!user) {
      setError('You must be logged in to perform an analysis.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // --- 1. CALL YOUR FASTAPI BACKEND ---
      const response = await fetch('http://localhost:8000/analyze-skin/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed.');
      }

      const resultData = await response.json();
      setAnalysisResult(resultData); // Show result on the screen

      // --- 2. SAVE THE RESULT TO SUPABASE ---
      const summary = createSummaryFromResult(resultData);
      
      const { error: insertError } = await supabase
        .from('analyses') // Your table name in Supabase
        .insert({
          user_id: user.id,
          result_summary: summary,
          full_result_json: resultData // Store the full JSON response
        });

      if (insertError) {
        setError(`Analysis successful, but failed to save to history: ${insertError.message}`);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Skin Analyzer</h1>
        <p className="text-gray-600 text-center mb-8">Upload a photo to analyze your skin conditions.</p>

        <Card>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Choose an image
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze My Skin'}
            </button>
          </form>
        </Card>

        {loading && (
          <div className="text-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing, please wait...</p>
          </div>
        )}

        {error && (
          <Card className="mt-8 bg-red-50 border-red-200 text-red-700">
            <p>{error}</p>
          </Card>
        )}

        {analysisResult && (
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Result</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analyzer;
import React, { createContext, useState, useContext } from 'react';

const HealthContext = createContext(null);

export const HealthProvider = ({ children }) => {
    const [latestPrediction, setLatestPrediction] = useState(null);
    const [healthScore, setHealthScore] = useState(null);
    const [predictionHistory, setPredictionHistory] = useState([]);

    const savePrediction = (result) => {
        setLatestPrediction(result);
        setHealthScore(result.health_score);
        setPredictionHistory((prev) => [result, ...prev].slice(0, 10)); // keep last 10
    };

    const clearHealth = () => {
        setLatestPrediction(null);
        setHealthScore(null);
        setPredictionHistory([]);
    };

    return (
        <HealthContext.Provider
            value={{
                latestPrediction,
                healthScore,
                predictionHistory,
                savePrediction,
                clearHealth,
            }}
        >
            {children}
        </HealthContext.Provider>
    );
};

export const useHealth = () => {
    const ctx = useContext(HealthContext);
    if (!ctx) throw new Error('useHealth must be used within HealthProvider');
    return ctx;
};

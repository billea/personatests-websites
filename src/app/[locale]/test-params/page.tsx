"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestParamsPage() {
    const searchParams = useSearchParams();
    const params = useParams();
    const [windowParams, setWindowParams] = useState<Record<string, string>>({});

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const windowParamsObj: Record<string, string> = {};
            for (const [key, value] of urlParams.entries()) {
                windowParamsObj[key] = value;
            }
            setWindowParams(windowParamsObj);
        }
    }, []);

    const testParams = ['name', 'testId', 'testResultId', 'email', 'token'];

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">URL Parameters Test</h1>
                
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Current URL</h2>
                    <p className="font-mono text-sm break-all bg-gray-100 p-3 rounded">
                        {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Search Parameters (Next.js useSearchParams)</h2>
                    <div className="space-y-2">
                        <p><strong>Raw toString():</strong> {searchParams.toString()}</p>
                        <div className="space-y-1">
                            {testParams.map(param => {
                                const value = searchParams.get(param);
                                return (
                                    <div key={param} className={`p-2 rounded ${value ? 'bg-green-50' : 'bg-red-50'}`}>
                                        <span className="font-mono">{param}:</span> 
                                        <span className={value ? 'text-green-600' : 'text-red-600'}>
                                            {value ? `"${value}"` : 'null'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Window Location Parameters</h2>
                    <div className="space-y-2">
                        <p><strong>window.location.search:</strong> {typeof window !== 'undefined' ? window.location.search : 'N/A'}</p>
                        <div className="space-y-1">
                            {testParams.map(param => {
                                const value = windowParams[param];
                                return (
                                    <div key={param} className={`p-2 rounded ${value ? 'bg-green-50' : 'bg-red-50'}`}>
                                        <span className="font-mono">{param}:</span> 
                                        <span className={value ? 'text-green-600' : 'text-red-600'}>
                                            {value ? `"${value}"` : 'undefined'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Route Parameters</h2>
                    <div className="space-y-1">
                        {Object.entries(params).map(([key, value]) => (
                            <div key={key} className="p-2 bg-blue-50 rounded">
                                <span className="font-mono">{key}:</span> "{String(value)}"
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
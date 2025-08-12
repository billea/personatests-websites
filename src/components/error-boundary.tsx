"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} reset={this.reset} />;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
          <div className="text-center p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Something went wrong
            </h2>
            <p className="text-white/80 mb-6">
              The application encountered an error. This is usually temporary.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.reset}
                className="px-4 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all"
              >
                Go Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left text-xs text-white/60">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
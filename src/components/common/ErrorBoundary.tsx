import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Heart, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React render error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50/60 px-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-md">
            <Heart className="w-8 h-8 fill-rose-500 text-rose-500 animate-pulse" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            Something went a little off track ✨
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto mb-6">
            We encountered a small hiccup while loading this experience. Don't worry, your celebration details are safe!
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm shadow-md transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 font-semibold text-sm border border-stone-200 shadow-xs transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

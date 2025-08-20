import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null  // Initialize errorInfo properly
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 React Error Boundary caught:', error, errorInfo);
    this.setState({ 
      error, 
      errorInfo  // Set errorInfo in state
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            background: "#fee",
            margin: "20px",
            border: "1px solid #fcc",
          }}
        >
          <h2>⚠️ Something went wrong</h2>
          <details style={{ marginTop: "10px" }}>
            <summary>Click for error details</summary>
            <pre
              style={{
                color: "red",
                fontSize: "12px",
                background: "#f9f9f9",
                padding: "10px",
                overflow: "auto",
                maxHeight: "200px",
              }}
            >
              {this.state.error && this.state.error.toString()}
              <br />
              {/* Safe access to componentStack */}
              {this.state.errorInfo?.componentStack ||
                "No component stack available"}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🔄 Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("UI error boundary caught", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="state-card danger">
          <h3>Application Error</h3>
          <p>An unexpected error occurred. Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

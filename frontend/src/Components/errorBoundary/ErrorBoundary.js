import React, { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: { message: "", stack: "" },
      // errorInfo: { componentStack: "" },
    };
  }

  static getDerivedStateFromError() {
    // error
    return { hasError: true };
  }

  componentDidCatch(
    error,
    // errorInfo
  ) {
    this.setState({
      error,
      // errorInfo
    });

    // log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    return hasError ? (
      <>
        <div
          className="d-flex align-items-center justify-content-between"
          style={{
            width: "100vw",
            height: "100vh",
            position: "relative",
            backgroundColor: "#f0f2f5",
            // backgroundImage: `url(${errorBackground})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          <div
            className="d-flex flex-column align-items-center"
            style={{ marginLeft: "5rem" }}
          >
            <h1
              style={{
                fontSize: "5rem",
                fontWeight: "600",
                color: "#fec887",
              }}
            >
              {error.message.includes("404") ? "Error: 404" : " Error: 500"}
            </h1>
            <h2 style={{ fontSize: "1rem", color: "#fec887" }}>
              {error.message.includes("404")
                ? "Page Not Found!"
                : "Something Went Wrong!"}
            </h2>
          </div>
          {/* <div>
<img src={errorImage} alt="" width="100%" height="100%" />
</div> */}
        </div>
      </>
    ) : (
      children
    );
  }
}

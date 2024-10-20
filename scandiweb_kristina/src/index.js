import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Your main App component
import reportWebVitals from './reportWebVitals';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import Creator from './Creator'; // Import your Creator component

const client = new ApolloClient({
  uri: 'http://localhost/graphql-server/scandiweb/public/index.php/graphql',
  cache: new InMemoryCache(),
});

class MainApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreatorLoaded: false,
    };
  }

  handleLoadComplete = () => {
    console.log('Creation completed');
    this.setState({ isCreatorLoaded: true }); // Update state when Creator has loaded
  };

  render() {
    const { isCreatorLoaded } = this.state;

    // If Creator is not loaded, show a loading message
    if (!isCreatorLoaded) {
      return (
        <div>
          <h1>Loading...</h1>
          <Creator client={client} onLoadComplete={this.handleLoadComplete} />
        </div>
      );
    }

    return (
      <div>
        <App />
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <MainApp /> {/* Render MainApp which manages Creator loading */}
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, { Component } from 'react';
import { CREATE_PRODUCTS, CREATE_CATEGORIES } from './queries'; // Assuming your mutations are defined in a separate file

class Creator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, // Set loading to true initially
      error: null,
    };
  }

  componentDidMount() {
    // Automatically create categories and products on component mount
    this.createCategories();
    this.createProducts();
  }

  createCategories = () => {
    this.props.client.mutate({
      mutation: CREATE_CATEGORIES,
    })
      .then(() => {
        console.log('Categories created successfully!');
        // Notify parent component if needed
        this.props.onLoadComplete(); 
      })
      .catch((error) => {
        this.setState({ error });
      });
  };

  createProducts = () => {
    this.props.client.mutate({
      mutation: CREATE_PRODUCTS,
    })
      .then(() => {
        console.log('Products created successfully!');
        // Notify parent component if needed
        this.props.onLoadComplete(); 
      })
      .catch((error) => {
        this.setState({ error });
      });
  };

  render() {
    const { loading, error } = this.state;

    if (loading) {
      return <p>Loading...</p>; // Show loading state
    }

    return (
      <div>
        {error && <p>Error: {error.message}</p>}
        <p>Creation process completed!</p>
      </div>
    );
  }
}

export default Creator;

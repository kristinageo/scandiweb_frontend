
import './App.css';
import Menu from './Menu';
import { Component } from 'react';
import MainBody from './MainBody';import ProductDetailsPage from './ProductDetailsPage';
;

class App extends Component{
  constructor(props)
  {
    super(props);
    this.state = {
      selectedProduct: null,
      productAttributes:null,
      activeLink: 'all',
      isProductSelected: false,
      isShoppingCartOpen: false,
      itemCounter: 0
    };
  }

  setActiveLink = (name) => {
    this.setState({ activeLink: name });
  };

  setProductActive = (isActive) => {
    this.setState({ isProductSelected: isActive });
  };


  handleProductClick = (product) => {
    this.setState((prevState) => {
      // Prevent product selection if the shopping cart is open
      if (prevState.isShoppingCartOpen) {
        return {}; // Return empty object to avoid state change
      }
  
      const isProductSelected = true; // Set isProductSelected to true since cart is closed
  
      return {
        selectedProduct: product,
        isProductSelected,
        isShoppingCartOpen: false, // Ensure shopping cart is closed
      };
    });
  };
  
  

  handleShoppingCartClick = () => {  
    this.setState({isProductSelected: false});
  }

  addToShoppingCart = (counter) => {
    this.setState({ 
      isProductSelected: false,
      isShoppingCartOpen: counter > 0, // Open if counter is greater than 0
      itemCounter: counter // Update the item counter
    });
  }

  toggleShoppingCart = () => {
    
    this.setState(
      (prevState) => ({
        isShoppingCartOpen: !prevState.isShoppingCartOpen,
      }),
      () => {
        console.log(this.state.isShoppingCartOpen); // Log the updated state after it's changed
      }
    );
  };

  updateItemCounter = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    this.setState({ itemCounter: cart.length }, () => {
        if (cart.length === 0) {
            this.setState({isShoppingCartOpen: false});
        } else {
            // Open the shopping cart if there are items
            this.setState({isShoppingCartOpen: true});
        }
       });
    
  }

  render(){
    const {  activeLink, isProductSelected, selectedProduct, isShoppingCartOpen, itemCounter } = this.state;

    return(
       <div className='container'>
          <Menu activeLink={activeLink} 
           setActiveLink={this.setActiveLink}
           setProductActive={this.setProductActive}
          isShoppingCartOpen={isShoppingCartOpen} 
          updateItemCounter={this.updateItemCounter}
          itemCounter={itemCounter} // Pass update function
          toggleShoppingCart={this.toggleShoppingCart}
          />
          {
            isProductSelected && !isShoppingCartOpen ? (
              <ProductDetailsPage selectedProduct={selectedProduct}    
              onAddToCartClick={this.addToShoppingCart}/>
            ) : (
              <MainBody activeLink={activeLink} 
              onProductClick={this.handleProductClick} 
              onShoppingCartClick={this.handleShoppingCartClick}
              isProductSelected={isProductSelected}
              isShoppingCartOpen={isShoppingCartOpen}
              />
            )}
       </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { Query } from '@apollo/client/react/components';
import { GET_CATEGORIES } from './queries';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import ShoppingCart from '../src/ShoppingCart';

class Menu extends Component {
  handleLinkClick = (linkName) => {
    this.props.setActiveLink(linkName); // Update active link in the parent
    this.props.setProductActive(false);
  };

  handleMenuShoppingCartClick = () => {
    // Toggle the shopping cart
    this.props.toggleShoppingCart(!this.props.isShoppingCartOpen);
  };

  componentDidMount() {
    this.checkCart();
  }

  checkCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.props.updateItemCounter(cart.length);
    this.props.toggleShoppingCart(cart.length > 0); // Open cart if items exist
  };

  onCartUpdate = () => {
    this.checkCart(); // Re-check the cart and update the item counter and shopping cart visibility
};

  render() {
    const { activeLink, isShoppingCartOpen, itemCounter } = this.props; // Get itemCounter from props
    const fillColor = itemCounter === 0 ? 'lightgrey' : 'black';

    return (
      <Query query={GET_CATEGORIES}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return (
            <div className='menu'>
              <div>
                <nav>
                  <ul className='menuLinksUl'>
                    {data.getCategories.map(({ id, name }) => (
                      <li key={id}>
                        <a
                          className={`menuLinksA menuLinksAColor ${activeLink === name ? 'active' : 'notActive'}`}
                          data-testid={activeLink === name ? 'active-category-link' : 'category-link'}
                          onClick={() => this.handleLinkClick(name)}
                        >
                          {name.toUpperCase()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div>
                <img src={`${process.env.PUBLIC_URL}/images/brand-logo.png`} alt="Brand Logo" style={{ width: '50px', height: '50px' }} />
              </div>
              <div className='shoppingCartContainer'>
                <div>
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    data-testid='cart-btn'
                    style={{ marginTop: '25px', color: fillColor, stroke: 'black', strokeWidth: '2px', position: 'relative' }}
                    onClick={() => this.handleMenuShoppingCartClick()}
                  />
                  {itemCounter > 0 && (
                    <span className="iconCounter">
                      {itemCounter}
                    </span>
                  )}
                </div>
                {isShoppingCartOpen && itemCounter > 0 && (
                  <ShoppingCart itemCounter={itemCounter} onCartUpdate={this.onCartUpdate}/>
                )}
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Menu;

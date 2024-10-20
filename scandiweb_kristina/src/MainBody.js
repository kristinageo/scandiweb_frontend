import React,{Component} from "react";
import { GET_PRODUCTS } from "./queries";
import { Query } from '@apollo/client/react/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

class MainBody extends Component{
    constructor(props){
      super(props);
      this.state = {
        itemCounter: 0
      }
    }

    handleProductClick = (product) => {
      //console.log(this.state.itemCounter);
       this.props.onProductClick(product);
    }

    capitalizeFirstLetter = (categoryName) => {
      return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    }

    handleShoppingCartClick = (product) => {

      const cartItem = {
        ...product,
        attributes: product.attributes.map((attr) => ({
             name: attr.name,
             items: attr.items.map((item, index) => ({
                displayValue: item.displayValue,
                value: item.value,
                id: item.id,
                isSelected: index === 0
             }))
        }))
      }

      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

      if(!Array.isArray(currentCart))
      {
        currentCart = [currentCart];
      }

      const updatedCart =  [ ...currentCart, cartItem];
      

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      

      this.props.onShoppingCartClick(product);
    }

    filterProducts = (products) => 
    {
        const {  activeLink } = this.props;
         if(activeLink === 'all')
         {
            return products;
         }


         const filterProductsSecond = products.filter(product => {
            const categoryName = product.category?.name;
            return categoryName === activeLink;
         });
       // console.log(filterProductsSecond);

         return filterProductsSecond;

    }

    componentDidMount() {
        this.checkCart();
    }

  checkCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cart.length === 0); // Check if the cart has items
    console.log(cart);

    if (cart.length === 0) {
         this.setState({ itemCounter: 0 });
    } else {
          console.log(this.state.itemCounter); // Log the current itemCounter state
          this.setState({ itemCounter: cart.length });
    }
  }
  
  

    render() {
        const { activeLink, isShoppingCartOpen } = this.props;
        const {  itemCounter  } = this.state;
        return (
          <Query query={GET_PRODUCTS}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;
             const filteredProducts = this.filterProducts(data.getProducts);
            // console.log(filteredProducts);
              return (
                
               <div className={`${isShoppingCartOpen && itemCounter > 0 ? 'blurredContainer' : 'notBlurredContainer'}`}>
                    
                      <p className='categoryNameMargin'>{this.capitalizeFirstLetter(activeLink)}</p>
                      <div className="gridContainer">
                        {filteredProducts.map(({ id, name, category, inStock, description, gallery, price, brand, attributes }) => {
                          const kebabCaseName = name.toLowerCase().replace(/\s+/g, '-');
                          return (
    
                          <div  
                          className={`gridItem ${!inStock ? 'outOfStock' : ''}`} data-testid={`product-${kebabCaseName}`}
                          onClick={() => this.handleProductClick({ id, name, category, inStock, description, gallery, price, brand, attributes })}>
                              <span data-category={category.id}></span>
                              <div className="imageContainer">
                              {gallery[0] && (
                              <img src={gallery[0]} alt={name} />
                              )}
                              {
                                  inStock === true && (
                                      <FontAwesomeIcon icon={faCartShopping} className="iconContainer" onClick={() => this.handleShoppingCartClick({ id, name, category, inStock, description, gallery, price, brand, attributes })}></FontAwesomeIcon>
                                  )
                              }
                              </div>
                              <div className="textContainer">
                                  <p style={{ margin: '0', textAlign: 'left' }}>{name}</p>
                                  <p style={{ margin: '0', textAlign: 'left' }}>${price}</p>
                              </div>
                          </div>
                        )})}
                      </div>
               </div>
                
              )
            }}
          </Query>
        );
      }
}


export default MainBody;
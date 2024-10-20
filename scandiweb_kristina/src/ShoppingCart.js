import { ApolloConsumer } from '@apollo/client';
import { Component } from  'react';
import { INSERT_ORDER } from './queries';


class ShoppingCart extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            cartItems: [],
            totalPrice: 0,
            itemCounter: 0
        };
        
    }
    
    calculateTotalPrice = (cartItems) => {
        return cartItems.reduce((total,item) => total + item.price,0 );
   }

    calculateItems = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
     
         let cartItemsMap = {};
         const selectedItems = [];

            cart.forEach(element => {
                ///should go by name, selected attributes compare them add quantity
            
                const selectedAttributes = element.attributes.map(attribute => {
                        const selectedItem = attribute.items.find(el => el.isSelected);
                        if (selectedItem) {
                            // Store the selected attribute value and name
                            selectedItems.push({
                                value: selectedItem.value,
                                name: attribute.name,
                            });
                            return `${attribute.name}:${selectedItem.value}`; // e.g., "color:red" or "capacity:64GB"
                        }
                        return null;
                    }).filter(Boolean); // Remove null values (attributes without selected items)
            
                    // Join the selected attributes to create a unique key
                    const uniqueKey = `${element.id}|${selectedAttributes.join('|')}`;

                    console.log(uniqueKey);

                    if (!cartItemsMap[uniqueKey]) {
                        // If it doesn't exist, create a new entry with quantity 1
                        cartItemsMap[uniqueKey] = { ...element, quantity: 1 };
                    } else {
                        // If it exists, increment the quantity
                        cartItemsMap[uniqueKey].quantity += 1;
                    }
             });

             console.log(cartItemsMap);

             const cartItems = Object.values(cartItemsMap);
             const itemCounter = cartItems.reduce((count, item) => count + item.quantity, 0);
             const totalPrice = this.calculateTotalPrice(cartItems);
     
             this.setState({ cartItems, itemCounter, totalPrice });

        
    }

    getBoxClassName = (attribute, item) => {   
        if (attribute.name === 'Color') {
          if (item.isSelected) {
            return 'selectedBoxBorderNotColor boxItem selectedBoxWidth'; 
          }
          return 'boxItem selectedBoxWidth';
        }
      
        if (attribute.name === 'Capacity') {
         
          if(item.isSelected)
          {
            return 'selectedBoxNotColor boxItem selectedBoxWidthCapacity borderWithoutSelectedColor';
          }
  
          return 'notSelectedBoxBackgroundColor boxItem selectedBoxWidthCapacity borderWithoutSelectedColor';
        }
      
        return item.isSelected ? 'selectedBoxNotColor selectedBoxWidth boxItem borderWithoutSelectedColor' 
        : 'notSelectedBoxBackgroundColor boxItem selectedBoxWidth borderWithoutSelectedColor'; 
      };

    componentDidMount() {
      //  console.log("ShoppingCart component mounted.");
      this.calculateItems();
    }

    handleAddingToShoppingCart = (item) => {
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        if(!Array.isArray(currentCart))
        {
          currentCart = [currentCart];
        }

       const updatedCart =  [ ...currentCart, item];
       console.log(JSON.stringify(updatedCart));


       localStorage.setItem('cart', JSON.stringify(updatedCart));

       
       this.calculateItems();

       this.props.onCartUpdate();
    }


    handleRemoveFromShoppingCart = (item) => {
        let updatedCart = this.state.cartItems.map((el) => {
            if (el.id === item.id) {
                const attributesMatch = el.attributes.every((attribute, index) => {
                    return attribute.items.every((attrItem, attrIndex) => 
                        attrItem.isSelected === item.attributes[index].items[attrIndex].isSelected
                    );
                });
    
                if (attributesMatch) {
                    // If quantity is greater than 1, decrement it; otherwise, return null to remove it
                    return el.quantity > 1 
                        ? { ...el, quantity: el.quantity - 1 } 
                        : null; // This will mark it for removal
                }
            }
            return el; // Return the unchanged item
        }).filter(Boolean); // Remove any null entries from the array

            // Update localStorage with the new cart
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Update state and item count in menu
        const itemCounter = updatedCart.reduce((count, item) => count + item.quantity, 0);
        const totalPrice = this.calculateTotalPrice(updatedCart);

        this.setState({ cartItems: updatedCart, itemCounter, totalPrice });

        this.props.onCartUpdate();
    }


    insertOrder = (client) => {

        const { cartItems, itemCounter, totalPrice } = this.state; // Get state values


        const formattedCartItems = cartItems.map(item => {
            const selectedItems = item.attributes.flatMap(attribute => 
                attribute.items
                    .filter(item => item.isSelected) // Filter selected items
                    .map(selectedItem => ({
                        attributeName: attribute.name, // Adjust this to match your GraphQL schema
                        value: selectedItem.value, // Adjust this to match your GraphQL schema
                    }))
            );
    
            return {
                id: item.id, // Ensure this matches your GraphQL schema
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                selectedItems: selectedItems, // Now populated with the selected attributes' items
            };
        });


        client.mutate({
          mutation: INSERT_ORDER,
          variables: { 
             quantity: itemCounter,
             totalPrice: totalPrice,
             cart: formattedCartItems,
          }, // Pass variables to the mutation
        })
        .then(response => {
          console.log('Item added to cart:', response.data.insertOrder);
          localStorage.setItem('cart', JSON.stringify([]));
          this.setState({ cartItems: [], itemCounter: 0, totalPrice: 0 });
          this.props.onCartUpdate();
        })
        .catch(error => {
          console.error('Error has happened while inserting the order to db:', error.message); // Log any errors
        });
    }
    
    

    render(){
        
        const {cartItems, totalPrice} = this.state;
        const itemCounter = cartItems.reduce((count, item) => count + item.quantity, 0); // Calculate dynamically
        return(
            <div className='shoppingItemContainer'>
               <span>
                
                <span style={{ fontWeight: 'bold'}}>My Bag, </span>
               
               {itemCounter} {itemCounter === 1 ? 'item' : 'items'}
               
               
               </span>
               <div className='shoppingItems'>
                     {cartItems.map((item) => (
                        <div>
                            <div style={{display: 'flex' , justifyContent: 'space-between' , alignItems: 'center' ,width : '100%'}}>
                                <div style={{flex: '50%'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <p>{item.name}</p> 
                                        <p><button data-testid='cart-item-amount-increase'
                                        style={{border: '2px solid black', padding: '2px', maxHeight:'20px'}} 
                                        onClick={() => this.handleAddingToShoppingCart(item)}>+</button></p>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <p>${item.price.toFixed(2)}</p>
                                        <p data-testid='cart-item-amount'>{item.quantity}</p>
                                    </div>
                                     <div style={{display: 'flex' , justifyContent: 'space-between'}}>
                                        <div style={{display: 'flex', flexDirection: 'column'}}>    
                                              {item.attributes.map((attribute) => (
                                                <span key={attribute.name} data-testid={`cart-item-attribute-${attribute.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                                    <span>{attribute.name}: </span> <br/>
                                                        {attribute.items.map((item) => (
                                                            <div 
                                                            className={this.getBoxClassName(attribute, item)}
                                                            data-testid={`cart-item-attribute-${attribute.name.toLowerCase().replace(/\s+/g, '-')}-${item.value.toLowerCase().replace(/\s+/g, '-')}${item.isSelected ? '-selected' : ''}`}
                                                            style={attribute.name === 'Color' ? { backgroundColor: item.value } : {}} 
                                                            >
                                                                <span style={{ fontSize : 'small', objectFit: 'contain'}}>
                                                                    { attribute.name !== 'Color' ? item.value : '' }
                                                                </span> 
                                                                <br/>
                                                            </div>
                                                        ))}
                                                </span>
                                        ))}
                                       </div>
                                       <div>
                                            <button data-testid='cart-item-amount-decrease'
                                             style={{border: '2px solid black', padding: '2px', maxHeight:'20px'}} 
                                                onClick={() => this.handleRemoveFromShoppingCart(item)}>-</button>
                                        </div>
                                     </div>
                                </div>
                                <div style={{flex: '50%'}} >
                                    <img src={item.gallery[0]} style={{width: '100%', 'paddingLeft': '5px'}}/> 
                                </div>
                            </div>
                        </div>
                     ))} 
               </div>
               <div style={{display: 'flex' , justifyContent: 'space-between', paddingTop : '10px'}}>
                     <div>
                        <p data-testid='cart-total'>Total: </p>
                    </div>

                    <div>
                       <p> ${totalPrice.toFixed(2)}</p>
                    </div>
               </div>
               <ApolloConsumer>
                {client => (
                    <div>
                        <button className='placeOrderBtn' onClick={() => this.insertOrder(client)}>Place Order</button>
                    </div>
                )}
               </ApolloConsumer>
            </div>
        )
    }
}

export default ShoppingCart;
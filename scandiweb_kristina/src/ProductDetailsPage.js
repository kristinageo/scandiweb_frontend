import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {React, Component} from 'react';


class ProductDetailsPage extends Component{
    
    constructor(props)
    {
        super(props);
        this.state = {
            currentImage: props.product?.gallery[0] || '',
            selectedAttributes: {},
            currentImageIndex: 0,
            itemCounter: 0
        }; 
    }

    componentDidMount() {
      this._isMounted = true;
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }
    handlePrevImage = () => {
       const {currentImageIndex} = this.state;

       if (currentImageIndex > 0) {
        this.setState({
          currentImageIndex: currentImageIndex - 1,
        });
      }
       
    }

    handleNextImage = () => {
      const {currentImageIndex} = this.state;
      const galleryLength = this.props.selectedProduct.gallery.length;
      if(currentImageIndex < galleryLength - 1) 
      {
        this.setState({currentImageIndex:  currentImageIndex + 1})

      }
      
   }

    handleBox = (attribute, itemValue) => {
       const updatedAttributes = { ...this.state.selectedAttributes };
       updatedAttributes[attribute.name] = itemValue;
       this.setState({selectedAttributes: updatedAttributes});
    };

    attributesSelected = () => {
      const { selectedProduct } = this.props;
   //   console.log(attributes);
      const { selectedAttributes } = this.state;

      if (!selectedProduct.attributes || !Array.isArray(selectedProduct.attributes)) {
        return false;
      }

      
      return  selectedProduct.attributes.every(attribute => selectedAttributes[attribute.name]);
    }

    addToShoppingCart = () => {
        
        const { selectedProduct } = this.props;
        const {selectedAttributes} = this.state;

        const selectedAttributesValues = selectedProduct.attributes.map(attr => ({
            name: attr.name,
            items: attr.items.map(item => ({
                displayValue: item.displayValue,
                value: item.value,
                id: item.id,
                isSelected: selectedAttributes[attr.name] === item.value // Check for match
            }))
        }));


        const cartItem = {
           ...selectedProduct,
           attributes: selectedAttributesValues
        }

        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];

        

        if(!Array.isArray(currentCart))
        {
          currentCart = [currentCart];
        }

       const updatedCart =  [ ...currentCart, cartItem];

       localStorage.setItem('cart', JSON.stringify(updatedCart));
       this.setState({ itemCounter: updatedCart.length }, () => {
        this.props.onAddToCartClick(this.state.itemCounter);
       });
    }

    getBoxClassName = (attribute, itemValue) => {
      const { selectedAttributes } = this.state;
      const isSelected = selectedAttributes[attribute.name] === itemValue;
    
      if (attribute.name === 'Color') {
        if (isSelected) {
          return 'selectedBoxBorderNotColor boxItem selectedBoxWidth'; // Selected color styling
        }
        return 'boxItem selectedBoxWidth'; // Default color box styling
      }
    
      if (attribute.name === 'Capacity') {
       
        if(isSelected)
        {
          return 'selectedBoxNotColor boxItem selectedBoxWidthCapacity borderWithoutSelectedColor';
        }

        return 'notSelectedBoxBackgroundColor boxItem selectedBoxWidthCapacity borderWithoutSelectedColor'; // Capacity box styling
      }
    
      return isSelected ? 'selectedBoxNotColor selectedBoxWidth boxItem borderWithoutSelectedColor' 
      : 'notSelectedBoxBackgroundColor boxItem selectedBoxWidth borderWithoutSelectedColor'; // Default styling
    };

    addToCart = (item) => {
      const updatedCart = [...this.state.cartItems, item];
      this.setState({ cartItems: updatedCart });
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    

    simpleHTMLParser = (htmlString) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        const reactElements = Array.from(tempDiv.childNodes).map((node, index) => {
          switch (node.nodeName) {
            case 'P':
              return <p key={index}>{node.textContent}</p>;
            case 'B':
            case 'STRONG':
              return <strong key={index}>{node.textContent}</strong>;
            case 'I':
            case 'EM':
              return <em key={index}>{node.textContent}</em>;
            case 'UL':
              return (
                <ul key={index}>
                  {Array.from(node.children).map((child, childIndex) => (
                    <li key={childIndex}>{child.textContent}</li>
                  ))}
                </ul>
              );
            case 'OL':
              return (
                <ol key={index}>
                  {Array.from(node.children).map((child, childIndex) => (
                    <li key={childIndex}>{child.textContent}</li>
                  ))}
                </ol>
              );
            default:
              return <div key={index}>{node.textContent}</div>;
          }
        });
      
        return reactElements;
      };

     render(){
       
        const { selectedProduct } = this.props;
        const { currentImageIndex, itemCounter } = this.state;
        return(
            <div className='productContainer'>
                <div className='galleryContainer' data-testid='product-gallery'>
                  <div className='galleryPreviewContainer'>
                      {selectedProduct.gallery.map((image, index) => (
                          <img src={image} key={index} alt={`img${index}`}
                          onClick={() => this.setState({currentImageIndex: index})} />
                      ))}
                  </div>
                  <div className='carouselContainer'>
                      <FontAwesomeIcon 
                      icon={faChevronLeft} 
                      className={`arrowLeft ${currentImageIndex === 0 ? 'disabledArrow' : ''}`}
                      onClick={() => this.handlePrevImage()}></FontAwesomeIcon>
                      <img src={selectedProduct.gallery[currentImageIndex]} alt="Current image" className='currentImage'/>

                      <FontAwesomeIcon 
                      icon={faChevronRight} 
                      className={`arrowRight ${currentImageIndex === selectedProduct.gallery.length - 1
                        ? 'disabledArrow' : ''}`}
                      onClick={() => this.handleNextImage()}></FontAwesomeIcon>
                  </div>
                </div>
                <div className='detailsContainer'>
                   <span style={{ paddingBottom: '10px'}}>{selectedProduct.name}</span>
                   
                     {selectedProduct.attributes && selectedProduct.attributes.map((attribute) =>{
                      const kebabCaseName = attribute.name.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <span data-testid={`product-attribute-${kebabCaseName}`}>
                          <span>{attribute.name}: </span> <br/>
                          {attribute.items.map((item) => (
                             <div 
                             className={this.getBoxClassName(attribute, item.value)}
                             style={attribute.name === 'Color' ? { backgroundColor: item.value } : {}} 
                             onClick={() => this.handleBox(attribute, item.value)}>
                                <span style={{ fontSize : 'small', objectFit: 'contain'}}>
                                  { attribute.name !== 'Color' ? item.value : '' }</span> 
                                  <br/>
                             </div>
                          ))}
                      </span>
                       )
                     }
                     )}

                   <span style={{fontWeight: 'bold'}}>Price:</span>
                   <span style={{fontWeight: 'bold', paddingBottom: '5px'}}>${selectedProduct.price}</span>
                   <button data-testid='add-to-cart'
                    disabled={!this.attributesSelected() || !selectedProduct.inStock}
                    onClick={() => this.addToShoppingCart(itemCounter)}
                    className={selectedProduct.inStock && this.attributesSelected() ? 'greenAddToCart' : 'greyAddToCart'}
                   style={{paddingBottom: '5px', marginTop: '10px', marginBottom: '15px'}} >Add to cart</button>
                   <div data-testid='product-description'>
                        {this.simpleHTMLParser(selectedProduct.description)}
                   </div>
                </div>
            </div>
        )
     }

}



export default ProductDetailsPage;
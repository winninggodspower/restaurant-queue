import { useState, useEffect } from "react";

function Menu({menuItems}) {
 
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  function handleItemClick(item) {
    let updatedCart = [...cart];

    // Check if the item is already in the cart
    const itemIndex = updatedCart.findIndex(cartItem => cartItem.id === item.id);

    if (itemIndex === -1) {
      // If the item is not in the cart, add it
      updatedCart.push(item);
    } else {
      // If the item is already in the cart, remove it
      updatedCart.splice(itemIndex, 1);
    }

    // Update the cart in state and localStorage
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Dispatch a custom event called "cartUpdated"
    const event = new CustomEvent('cartUpdated', {
      detail: { cart: updatedCart },
    });
    window.dispatchEvent(event);
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 mx-4 mb-10">
    <div className="grid gap-y-6 gap-4">
      {
        menuItems.map((item)=>
          <div  key={item.id} id={item.id} className="menu-item grid grid-cols-[120px_1fr] gap-4 sm:gap-6 rounded-md shadow-md">
            <img
              src={item.imageUrl}
              alt="Chicken Parmesan"
              width="120px"
              height="120px"
              className="rounded-lg object-cover aspect-square"
            />
            <div className="grid gap-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-muted-foreground">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-semibold">${item.price}</span>
                <button onClick={()=>{handleItemClick(item)}} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                {cart.find(cartItem => cartItem.id === item.id) ? 'Remove from Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
          )
      }
    </div>
  </div>
  )
}

export default Menu
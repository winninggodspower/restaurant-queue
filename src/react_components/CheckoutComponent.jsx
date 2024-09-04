import { useState } from 'react'
import QueuePopup from './QueuePopup';

function CheckoutComponent() {
    const [showPopup, setShowPopup] = useState(false);
    // get cart items
    const storedCart = JSON.parse(window.localStorage.getItem('cart')) || [];
    const totalPrice = storedCart.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0)
    console.log(totalPrice);

    const openPopup = ()=>{
        setShowPopup(true);
    }

    const clearLocalStorageCart = ()=>{
        localStorage.removeItem('cart');

        // Dispatch a custom event called "cartUpdated"
        const event = new CustomEvent('cartUpdated', {
            detail: { cart: [] },
        });
        window.dispatchEvent(event);
    }

    const placeOrder = async () => {
        console.log(storedCart);
        
        try {
            let response = await fetch('/api/order/send_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({menu_items: storedCart})
            })
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error placing order:", errorData.error);
            } else {
                const data = await response.json();
                console.log("Order placed successfully:", data.message);
                
                // clear localstorage cart
                clearLocalStorageCart();

                // raise popup
                openPopup()
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    return (
        <div className="space-y-4">
            {storedCart.map((item) => {
                return (
                    <div key={item.id} className="flex justify-between items-center">
                        <div>
                            <h3 className="">{item.name}</h3>
                            <p className="text-sm text-gray-500">1 x {item.price.toLocaleString("en-US")}</p>
                        </div>
                        <p className="font-medium">₦{item.price.toLocaleString("en-US")}</p>
                    </div>
                )
            })}

            <hr className="py-2" />
            <div className="flex justify-between items-center">
                <p className="font-medium">Subtotal</p>
                <p className="font-medium">₦{totalPrice.toLocaleString("en-US")}</p>
            </div><div className="mt-3">
                <button onClick={placeOrder} className='btn'>order</button>
            </div>
            {showPopup && <QueuePopup />}
        </div>
    )
}

export default CheckoutComponent
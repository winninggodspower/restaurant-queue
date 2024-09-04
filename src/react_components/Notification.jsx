import {useState, useEffect} from 'react'

function Notification() {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load initial cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);

    // Listen for the "cartUpdated" event
    function handleCartUpdated(event) {
      setCart(event.detail.cart);
    }

    window.addEventListener('cartUpdated', handleCartUpdated);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  return (
    <div>
        <button
            type="button"
            onClick={()=>{setIsOpen(!isOpen);}}
            className="relative inline-flex items-center text-gray-800 font-medium text-center ">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
                </svg>
            <span className="sr-only">Notifications</span>
            <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2">
            {cart.length}
            </div>
        </button>
        <div className={`w-48 absolute rounded-sm p-4 bg-white shadow-md border-gray-700 
            ${isOpen ? '' : 'hidden'}`}>
            <p className='mb-2'>₦{cart.reduce((accumulator, currentItem)=>{
                console.log(currentItem);
                return accumulator + currentItem.price;
                }, 0).toLocaleString("en-US")}</p>
            <a href='/checkout' className='btn'>checkout</a>
        </div>
    </div>
  )
}

export default Notification
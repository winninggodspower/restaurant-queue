import { supabase } from "../lib/supabase";

export async function fetchOrdersWithTotalPrice() {
    const { data, error } = await supabase
      .from("Order")
      .select(
        `
        id,
        user_id,
        order_date,
        is_completed,
        CartItem (
          id,
          menu_item_id,
          menuitem:menu_item_id (price, name)
        )
      `,
      )
      .order("id");
  
    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  
    const ordersWithTotalPrice = data.map((order) => {
      
      const itemNames = order.CartItem.reduce((names, item)=> {
        return '' ? names : item.menuitem.name + ', ' + names;
      }, '');

      const totalPrice = order.CartItem.reduce((sum, item) => {
        return sum + item.menuitem.price;
      }, 0);
  
      
      return {
        order_id: order.id,
        is_completed: order.is_completed,
        user_id: order.user_id,
        order_data: new Date(order.order_date).toLocaleTimeString(),
        total_price: totalPrice,
        item_names: itemNames,
      };
    });

    return ordersWithTotalPrice;
  
  }

export async function fetchOrdersWithDetails() {    
  const { data, error } = await supabase
    .from('Order')
    .select(`
      id,
      is_completed,
      CartItem (
        MenuItem (
          id,
          name,
          price
        )
      )
    `)
    .order('order_date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data.map(order => ({
    id: order.id,
    is_completed: order.is_completed,
    items: order.CartItem.map(item => ({
      name: item.MenuItem.name,
      price: item.MenuItem.price
    })),
    total_price: order.CartItem.reduce((sum, item) => sum + (item.MenuItem.price * item.quantity), 0)
  }));
}
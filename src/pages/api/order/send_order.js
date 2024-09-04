
import { supabase } from "../../../lib/supabase";

export const POST = async ({ request, redirect, cookies }) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  const { data, error } = await supabase.auth.setSession({
    refresh_token: refreshToken.value,
    access_token: accessToken.value,
  });

  // reject anauthorize user
  if(!data?.user){
    return new Response({message: 'Unauthorize'}, 401)
  }


  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const menuItems = body.menu_items;

    try {
      // createOrder
      let order = await createOrder(data.user.id);      

      // create order item
      await addOrderItems(menuItems, order[0].id)
      
      return new Response(JSON.stringify({ message: "Successfully placed order" }), { status: 200 });
    } catch (error) {
      console.log(error.message);
      
      return new Response(JSON.stringify({ message: 'Error placing order', error: error.message }), { status: 500 });
    }

  }

  return new Response(JSON.stringify({'message': 'invalid data'}))
};


async function createOrder(user_id) {
  const { data, error } = await supabase
  .from('Order')
  .insert({user_id: user_id})
  .select()

  if (error) throw error;

  return data;
}

async function addOrderItems(orderItems, order_id) {
  console.log(orderItems.map((item)=> ({menu_item_id: item.id, order_id})));
  
  const { error } = await supabase
  .from('CartItem')
  .insert(
    orderItems.map((item)=> ({menu_item_id: item.id, order_id}))
  )

  if (error) {
    console.log(error);
    throw error
  };

  return 'sucess';
}
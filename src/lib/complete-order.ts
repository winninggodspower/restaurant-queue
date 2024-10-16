import { supabase } from './supabase';
import nodemailer from 'nodemailer';

interface OrderDetails {
  order_id: string;
  item_names: string;
  total_price: number;
}

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true, // use TLS
  auth: {
    user: import.meta.env.SMTP_USER,
    pass: import.meta.env.SMTP_PASSWORD,
  },
});

async function sendOrderCompletionEmail(userEmail: string, orderDetails: OrderDetails) {
  const mailOptions = {
    from: '"Oyo\'s Restaurant" <noreply@oyos\'srestaurant.com>',
    to: userEmail,
    subject: 'Your Order is Complete',
    text: `Dear Customer,\n\nYour order (ID: ${orderDetails.order_id}) has been completed.\n\nOrder Details:\nItems: ${orderDetails.item_names}\nTotal Price: $${orderDetails.total_price.toFixed(2)}\n\nThank you for your business!\n\nBest regards,\nYour Company`,
    html: `<h1>Your Order is Complete</h1>
           <p>Dear Customer,</p>
           <p>Your order (ID: ${orderDetails.order_id}) has been completed.</p>
           <h2>Order Details:</h2>
           <p><strong>Items:</strong> ${orderDetails.item_names}</p>
           <p><strong>Total Price:</strong> ₦${orderDetails.total_price.toFixed(2)}</p>
           <p>Thank you for your business!</p>
           <p>Best regards,<br>Your Company</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function completeOrder(orderId: string | FormDataEntryValue) {
  // Fetch the order details
  const { data: orderData, error: fetchError } = await supabase.from('Order')
    .select(`
      id,
      user_id,
      CartItem (
        id,
        menu_item_id,
        menuitem:menu_item_id (price, name)
      )
    `)
    .eq('id', orderId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  // Update the order status
  const { error: updateError } = await supabase
    .from('Order')
    .update({ is_completed: true })
    .eq('id', orderId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  // get user email
  const {error: getUserError, data: userData} = await supabase.from('profiles').select(`
      name,
      email
    `)
    .eq('user_id', orderData.user_id)
    .single();
  
  if (getUserError) {
    console.log(`Error fetching user details: ${getUserError.message}`);
  }
  console.log(userData.email);
  

  // Send email to the user
  try {
    await sendOrderCompletionEmail(userData.email, {
      order_id: orderData.id,
      item_names: orderData.CartItem.reduce((names, item)=> {
        return names.trim.length == 0 ? names : item.menuitem.name + ', ' + names;
      }, ''),
      total_price:  orderData.CartItem.reduce((sum, item) => {
        return sum + item.menuitem.price;
      }, 0)
    });
  } catch (emailError) {
    console.error('Failed to send email:', emailError);
    // Note: We're not throwing here, as we still want to mark the order as complete even if email fails
  }

  return { success: true };
}
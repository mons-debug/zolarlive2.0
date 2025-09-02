import { NextRequest, NextResponse } from 'next/server';

// Brevo API integration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID || '1'; // Default list ID, you can change this

interface OrderData {
  customerName: string;
  customerCity: string;
  customerPhone?: string;
  selectedProducts: {
    borderlineBlack?: {
      selected: boolean;
      size: string;
      quantity: number;
    };
    spinWhite?: {
      selected: boolean;
      size: string;
      quantity: number;
    };
  };
  orderTotal: number;
  subtotal: number;
  discount: number;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json();

    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'Brevo API configuration missing' },
        { status: 500 }
      );
    }

    // Prepare contact data for Brevo
    const contactData = {
      email: `${orderData.customerName.toLowerCase().replace(/\s+/g, '.')}@placeholder.com`, // Temporary email since we don't collect it
      attributes: {
        FIRSTNAME: orderData.customerName,
        LASTNAME: '', // We can split name later if needed
        SMS: orderData.customerPhone || '',
        CITY: orderData.customerCity,
        ORDER_TOTAL: orderData.orderTotal,
        ORDER_SUBTOTAL: orderData.subtotal,
        ORDER_DISCOUNT: orderData.discount,
        BORDERLINE_SELECTED: orderData.selectedProducts.borderlineBlack?.selected || false,
        BORDERLINE_SIZE: orderData.selectedProducts.borderlineBlack?.size || '',
        BORDERLINE_QTY: orderData.selectedProducts.borderlineBlack?.quantity || 0,
        SPIN_SELECTED: orderData.selectedProducts.spinWhite?.selected || false,
        SPIN_SIZE: orderData.selectedProducts.spinWhite?.size || '',
        SPIN_QTY: orderData.selectedProducts.spinWhite?.quantity || 0,
        ORDER_DATE: new Date().toISOString(),
        SOURCE: 'Zolar Website'
      },
      listIds: [parseInt(BREVO_LIST_ID)]
    };

    // Send to Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(contactData)
    });

    if (!brevoResponse.ok) {
      // If contact already exists, try to update instead
      if (brevoResponse.status === 400) {
        const updateResponse = await fetch(`https://api.brevo.com/v3/contacts/${contactData.email}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': BREVO_API_KEY
          },
          body: JSON.stringify({
            attributes: contactData.attributes,
            listIds: contactData.listIds
          })
        });

        if (!updateResponse.ok) {
          console.error('Brevo update failed:', await updateResponse.text());
          return NextResponse.json(
            { error: 'Failed to update contact in Brevo' },
            { status: 500 }
          );
        }
      } else {
        console.error('Brevo API error:', await brevoResponse.text());
        return NextResponse.json(
          { error: 'Failed to send data to Brevo' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order data sent to Brevo successfully' 
    });

  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

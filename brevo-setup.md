# Brevo Integration Setup

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# Brevo (SendinBlue) API Configuration
# Get your API key from: https://app.brevo.com/settings/keys/api
BREVO_API_KEY=your_brevo_api_key_here

# Brevo List ID where contacts will be added
# You can find this in your Brevo dashboard under Contacts > Lists
BREVO_LIST_ID=1
```

## Brevo Setup Steps

1. **Create Brevo Account**: Go to https://www.brevo.com and sign up
2. **Get API Key**: 
   - Login to Brevo dashboard
   - Go to Settings > API Keys
   - Create a new API key with "Contact" permissions
3. **Create Contact List**:
   - Go to Contacts > Lists
   - Create a new list called "Zolar Orders" or similar
   - Note the List ID number
4. **Custom Attributes**: The API will automatically create these attributes when first contact is added:
   - CITY (Text)
   - ORDER_TOTAL (Number)
   - ORDER_SUBTOTAL (Number)
   - ORDER_DISCOUNT (Number)
   - BORDERLINE_SELECTED (Boolean)
   - BORDERLINE_SIZE (Text)
   - BORDERLINE_QTY (Number)
   - SPIN_SELECTED (Boolean)
   - SPIN_SIZE (Text)
   - SPIN_QTY (Number)
   - ORDER_DATE (Date)
   - SOURCE (Text)

## Testing

After setup, you can test the integration by submitting an order through the website. Check your Brevo dashboard to see if the contact appears in your specified list.

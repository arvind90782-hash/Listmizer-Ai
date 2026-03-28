# Shiprocket Shipping Predictor Fix - TODO

## [x] Step 1: Update inputs and validation
- Rename states: origin->pickupPincode, destination->deliveryPincode, dims l/w/h -> length/breadth/height
- Labels: Pickup Pincode, Delivery Pincode, Weight(kg), Length(cm), Breadth(cm), Height(cm)
- Strict validate: all required or show msg & return

## [x] Step 2: Fix image upload
- Add file.size > 5MB check -> error
- Make optional (remove require)

## [x] Step 3: Add Shiprocket auth
- State: token?: string
- localStorage 'shiprocket_token'
- Function auth(): POST login, store token/expiry

## [x] Step 4: Real API in handlePredict
- Validate
- If !token, await auth()
- GET serviceability with params & Bearer token
- Parse response.data.available_courier_companies (assume structure)

## [x] Step 5: Display results
- Sort by rate asc
- Map to cards: name, cost=rate, days=etd, rating='⭐⭐⭐⭐'
- Remove fake data

## [x] Step 6: Courier click redirect
- window.open('https://app.shiprocket.in/shipment/create?pickup_postcode=...' + params)

## [x] Step 7: UI improvements
- Buttons: h-10 px-6 rounded-lg shadow-sm hover:shadow-md
- Cards: hover:scale-[1.02] shadow-md
- Professional spacing

## [ ] Step 8: Errors
- Auth fail, API fail, invalid pin, no services -> msgs

## [ ] Step 9: Test & complete

Updated: When step done, mark [x]

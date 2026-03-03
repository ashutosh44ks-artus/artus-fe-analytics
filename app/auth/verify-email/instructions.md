General Guidelines:
- using source.html build the page in Next.js
- do not use source.html for markup and styles, read the code then implement using the best next.js practices. components go in the ./components folder.
- don't use orange color, instead use primary color. Primary is our brand and a specific shade of orange, so we should use it instead of a generic orange color.
- use shadcn components and styles as much as possible
- in case any new package is needed from shadcn, always ask. I'll allow it. but don't be afraid to create custom components if needed as well. The goal is to have a consistent look and feel across the app, so if you think a custom component is needed to achieve that, go for it.
- use icons from Lucide Icons or react-icons
- use logo as - import OrangeLogo from "@/components/assets/orrange-logo.png"; - instead of haseeb's
- use vercel-react-best-practices skills to build the page.


Page Specifications:
- use otp box from shadcn ui for the OTP input
- @app.post("/luna_login") - takes OTP as "otp" in payload - will be called when the user clicks Verify
- use react query + axios to call the api route (already setted up)
- have a timer of 5 mins, we can only call the api route once every 5 mins, if the user tries to call it before that, show an error message "Please wait for 5 minutes before trying again."
- show a success message "OTP verified successfully!" if the API call is successful, otherwise show an error message "Invalid OTP. Please try again."
- after successful verification, redirect the user to the dashboard page ("/dashboard")
General Guidelines:
- using source.html build the page in Next.js
- do not use source.html for markup and styles, read the code then implement using the best next.js practices. components go in the components folder.
- don't use orange color, instead use primary color. Primary is our brand and a specific shade of orange, so we should use it instead of a generic orange color.
- use shadcn components and styles as much as possible
- in case any new package is needed from shadcn, always ask. I'll allow it. but don't be afraid to create custom components if needed as well. The goal is to have a consistent look and feel across the app, so if you think a custom component is needed to achieve that, go for it.
- use icons from Lucide Icons or react-icons


Page Specifications:
- @app.post("/luna_otp") will be called when the user clicks Activate Access Protocol
- use react query + axios to call the api route (already setted up)
- do the onClick thing that is done on the source.html, then if success navigate to auth/verify-email
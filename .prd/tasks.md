# TASKS INSTRUCTIONS:
Lets consider our .cursor/rules as the general rules for the project    
structure and the depositlock-website/.prd folder files as the Product  
requirements documents. 
The project's PRDs are important to follow. But it should not go against our global rules. Please refactor the project structure.
Lets do all step by step.
During conversations act pro-actively and generate tasks under sections Bugs OR Features that are needed to be fulfilled later. Mark as completed with [x]. Feel free to remove tasks from list that represent whole feature have been completed.

# Features
- [ ] Add support for partial filling, disputing over and releasing partial amount from the contract. After the release - some of the funds should go to the depositor, the rest to the creator of the contract.
- [ ] Allow releasing for the depositor after the deadline has reached.
- [ ] Enable Polygon mainnet support and network selection

# Bugs
- [ ] After the deposit was filled, I have to reload the page to see the status update.
- [ ] Fix responsive UI bugs on header, dashboard agreement list cards
- [ ] Fix unknown network bug
- [ ] Fix mobile scrolling bug involving header stop point.

# POSTPONED TASKS:
[ ] Wire wallet connect hooks into SPA routes using `@repo/ui` shadcn primitives
[ ] Replace `react-router-dom` Links with Next `Link` in migrated components
[ ] Replace Radix usage with Shadcn components where used in this app

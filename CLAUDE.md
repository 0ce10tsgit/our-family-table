# Our Family Table

## Development & style notes

This was built incrementally and user-dictated — small, reviewed steps with placeholder/stand-in content rather than auto-populated data, and only minimal JS kept in a separate `landingpage.js`. Structure is data-driven: filter categories and the Explore sections are generated from `filters.json`. The current style is a warm, minimal recipe site — nav tabs up top, a search bar with category filter dropdowns, and Netflix-style horizontal carousels that show three cards across the display and page in groups of three.

## Planned functionality

Search should combine the text query with the filters checked across the category dropdowns (Cuisine, Meal Type, Allergens, Diet) to narrow the displayed recipes.

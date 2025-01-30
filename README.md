# Segmentify Frontend Developer Case

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)

## Features

- **Next Button Validation**: The "Next" button remains disabled until a selection is made, preventing progression without input.
- **Step Indicator**: Step counter accurately updates with "Next" and "Back" button actions, providing clear navigation progress.
- **Back Navigation**: Users can return to previous filter steps using the "Back" button, maintaining their selections.
- **Dynamic Product Filtering**: Products are filtered and displayed based on all selected criteria when steps are completed.
- **Empty State Handling**: Displays "No Product Found" message when no products match the selected filters.
- **Price Formatting**: Product prices are displayed in the specified format with proper currency symbols.
- **Lazy Loading**: Product images are loaded using lazy loading for improved performance.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- jQuery
- Slick Carousel
- Font Awesome

## Project Structure

```
   src/
    ├── constants/                  # Constant values and types
    │   └── types.js                # Type definitions and enums
    ├── data/                       # Data
    │   └── questions.json          # Questions data
    │   └── products.json           # Products data
    ├── models/                     # Models
    │   ├── Question.js             # Question model
    │   └── Product.js              # Product model
    ├── services/                   # Services
    │   └── api.js                  # Api services
    ├── styles/                     # Global styles
    │   ├── styles.css              # Main styles
    │   ├── reset.css               # Reset CSS
    │   ├── slick.css               # Slick carousel styles
    │   └── variables.css           # Variables
├── app.js                          # App entry point
└── index.html                      # Entry point for the app
```

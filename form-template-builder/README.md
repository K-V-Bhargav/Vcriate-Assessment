# Form Template Builder

A powerful React + TypeScript application for creating, managing, and submitting custom form templates with real-time validation and local storage persistence.

## Features

### Template Management
- Create up to 5 custom form templates
- Organize templates with sections for better content grouping
- Add various field types to each section:
  - **Label**: Static text with different heading styles (h1, h2, h3)
  - **Text**: Single-line text input with validation options
  - **Number**: Numeric input with min/max validation
  - **Boolean**: Checkbox for yes/no selections
  - **Enum**: Dropdown select with customizable options
- Drag-and-drop reordering of fields within sections
- Real-time template preview while editing
- Persistence via local storage

### Field Editor
- Comprehensive field configuration options
- Field-specific properties (min/max for numbers, options for enums, etc.)
- Required field designation
- Placeholder text customization
- Interactive preview mode with two options:
  - Static preview: See how the field will appear in the form
  - Test mode: Input test values and see validation feedback in real-time

### Form Rendering
- Dynamic form generation from selected templates
- Real-time validation as users complete fields
- Clear error messages with visual indicators
- Form submission with validation
- Success feedback after submission
- View previous submissions for each template
- Timestamp tracking for all submissions

### Data Management
- All templates and form submissions stored in local storage
- Persistent data across browser sessions
- View historical form submissions by template

## Application Flow

### Template Builder Flow
1. **Create Template**: Start by creating a new template with a name and description
2. **Add Sections**: Organize your form with logical sections
3. **Add Fields**: Add various field types to each section
4. **Configure Fields**: Set validation rules, required status, and other properties
5. **Preview Fields**: Test your fields in real-time with the preview mode
6. **Reorder Fields**: Drag and drop to arrange fields in the desired order
7. **Save Template**: Templates are automatically saved to local storage

### Form Filling Flow
1. **Select Template**: Choose from available templates
2. **Fill Form**: Complete the form fields
3. **Validation**: Receive immediate feedback on field validation
4. **Submit Form**: Submit the completed form
5. **Success Feedback**: See confirmation of successful submission
6. **View Submissions**: Access previous submissions for the template

## Technical Implementation

### State Management
- Zustand store for global state management
- Local storage persistence for templates and form submissions

### UI Components
- React functional components with TypeScript
- Tailwind CSS for styling
- Responsive design for various screen sizes

### Validation
- Field-level validation with specific rules per field type
- Form-level validation before submission
- Clear error messaging with visual indicators

### Drag and Drop
- Implemented using @dnd-kit library
- Smooth reordering of fields within sections

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd form-template-builder

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

### Building for Production
```bash
npm run build
# or
yarn build
```

## Usage Examples

### Creating a Contact Form Template
1. Create a new template named "Contact Form"
2. Add a "Contact Information" section
3. Add fields:
   - Label: "Contact Information" (h2 style)
   - Text: "Full Name" (required)
   - Text: "Email" (required)
   - Text: "Phone Number"
   - Enum: "Preferred Contact Method" with options (Email, Phone, Either)
4. Add a "Message" section
5. Add fields:
   - Label: "Your Message" (h2 style)
   - Text: "Subject" (required)
   - Text: "Message" (required)
6. Preview and test the form
7. Save the template

### Creating a Survey Template
1. Create a new template named "Customer Satisfaction Survey"
2. Add a "Rating" section
3. Add fields:
   - Label: "Please rate our service" (h2 style)
   - Number: "Overall Rating" (min: 1, max: 5, required)
   - Boolean: "Would you recommend us to others?"
4. Add a "Feedback" section
5. Add fields:
   - Label: "Additional Feedback" (h2 style)
   - Text: "What did you like most about our service?"
   - Text: "How can we improve?"
6. Preview and test the form
7. Save the template

## License
[MIT License](LICENSE)

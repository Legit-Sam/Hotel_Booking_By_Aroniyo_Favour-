// README.md
# Hotel Information System

A modern, responsive hotel booking platform built with Next.js 14, Tailwind CSS, and Framer Motion.

## Features

### 🏨 Core Functionality
- **Hotel Listings**: Browse featured hotels with image galleries, pricing, and amenities
- **Advanced Search**: Search by hotel name, city, or state with real-time filtering
- **Location Filtering**: Filter hotels by state and city with dynamic dropdowns
- **Price Range Filter**: Slider-based price filtering for budget-conscious travelers
- **Hotel Details**: Comprehensive hotel pages with image carousels, room types, and amenities
- **WhatsApp Integration**: Direct booking via WhatsApp with pre-filled messages

### 🎨 Design & UX
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, minimal design with rounded corners and soft shadows
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Dark/Light Theme**: Clean neutral color palette with optional theme support
- **Interactive Elements**: Hover effects, transitions, and micro-interactions

### 🔧 Admin Features
- **Hotel Management**: Create new hotels with comprehensive details
- **Image Upload**: Multiple image upload with drag-and-drop support
- **Dynamic Room Management**: Add/remove room types with pricing
- **Amenity Management**: Select from predefined amenities or add custom ones
- **Location Selection**: State and city selection with dynamic filtering

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Image Handling**: Next.js Image optimization

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hotel-information-system
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
hotel-information-system/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API routes
│   │   └── hotels/              # Hotel API endpoints
│   ├── admin/                   # Admin dashboard
│   ├── hotel/[id]/             # Dynamic hotel detail pages
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout
│   └── page.js                 # Home page
├── components/                  # Reusable components
│   ├── admin/                  # Admin-specific components
│   ├── filters/                # Filter components
│   ├── home/                   # Home page components
│   ├── hotel/                  # Hotel detail components
│   ├── hotels/                 # Hotel listing components
│   └── layout/                 # Layout components
├── lib/                        # Utility libraries
│   ├── api.js                  # API functions
│   └── utils.js                # Helper utilities
├── hooks/                      # Custom React hooks
├── public/                     # Static assets
└── tailwind.config.js          # Tailwind configuration
```

## Key Components

### Layout Components
- **Navbar**: Responsive navigation with mobile menu
- **Footer**: Site footer with contact information

### Home Page Components
- **HeroSection**: Full-screen hero with search functionality  
- **FilterPanel**: Advanced filtering with state/city/price controls
- **HotelGrid**: Responsive grid layout for hotel listings
- **HotelCard**: Individual hotel preview cards

### Hotel Detail Components
- **ImageCarousel**: Interactive image slider with navigation
- **RoomsList**: Available room types and pricing
- **AmenitiesList**: Hotel amenities with icons
- **ContactInfo**: Hotel contact details
- **BookingButton**: WhatsApp booking integration

### Admin Components
- **ImageUpload**: Drag-and-drop image upload interface
- **RoomManager**: Dynamic room type and pricing management
- **AmenityManager**: Amenity selection and management
- **LocationSelector**: State and city selection

## API Integration

The system includes mock data for development but is designed to work with a backend API:

### Endpoints
- `GET /api/hotels` - Fetch all hotels
- `GET /api/hotels/[id]` - Fetch hotel by ID
- `POST /api/hotels` - Create new hotel

### Mock Data
The system includes comprehensive mock data with 6 sample hotels across different states, including images, room types, amenities, and contact information.

## Customization

### Adding New States/Cities
Update the `statesData` object in `components/admin/LocationSelector.js`:

```javascript
const statesData = {
  'YourState': ['City1', 'City2', 'City3'],
  // ... more states
}
```

### Custom Amenities
Add new amenities to the predefined list in `components/admin/AmenityManager.js`:

```javascript
const predefinedAmenities = [
  'Your Custom Amenity',
  // ... existing amenities
]
```

### Styling Customization
Modify `tailwind.config.js` to customize colors, animations, and design tokens:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      }
    }
  }
}
```

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_API_URL=your-api-url
NEXT_PUBLIC_WHATSAPP_NUMBER=your-whatsapp-number
```

## Performance Features

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting with Next.js
- **Lazy Loading**: Components and images load on demand
- **Caching**: Built-in caching for API responses
- **SEO Optimization**: Meta tags and structured data

## Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@hotelhub.com or join our Slack channel.

---

Built with ❤️ using Next.js and Tailwind CSSfilters.priceRange
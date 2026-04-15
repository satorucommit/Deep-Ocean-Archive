# 🌊 Deep Ocean Intelligence Archive

A stunning, immersive deep-sea exploration platform built with modern web technologies. Dive into the abyss, discover bioluminescent creatures, and explore the mysteries of Earth's deepest oceans.

## ✨ Overview

The Deep Ocean Intelligence Archive is an interactive single-page application that simulates descending through five distinct ocean depth zones, from the sunlit surface to the crushing hadal depths. Experience realistic oceanographic phenomena, encounter fascinating creatures, and engage with educational content about deep-sea exploration.

**[Live Demo](#)** • **[Documentation](#)** • **[Report Bug](https://github.com/issues)** • **[Request Feature](https://github.com/issues)**

---

## 🚀 Key Features

### 🏞️ Immersive Depth Zones
- **Sunlight Zone** (0-200m): Photosynthetic organisms and bright marine life
- **Twilight Zone** (200-1,000m): Bioluminescent creatures and sparse sunlight
- **Midnight Zone** (1,000-4,000m): Complete darkness and specialized adaptations
- **Abyssal Zone** (4,000-6,000m): Extreme pressure and minimal energy
- **Hadal Zone** (6,000-11,000m): The deepest trenches on Earth

### 🎮 Interactive Elements
- **Scroll-based Depth Tracking**: Dive deeper as you scroll with real-time depth and pressure metrics
- **Submarine Light Effect**: Radial gradient light that follows your cursor, revealing creatures in darkness
- **Creature Profiles**: 16 detailed creature cards with bioluminescence toggles and species information
- **Discovery Log**: Track discovered species with progress monitoring
- **Pressure Lab**: Interactive slider demonstrating object deformation at various depths
- **Expedition Timeline**: 5 historical deep-sea exploration missions
- **Threat Map**: Visualization of 6 major ocean conservation challenges
- **Acoustic Mapping Room**: Live waveform visualization for 6 ocean soundscapes

### 🎵 Audio Experience
- **Web Audio API Integration**: Immersive soundscapes including:
  - Ambient oceanic hum
  - Sonar pings
  - Bubble sounds
  - Whale songs
  - Depth milestone chimes
  - Pressure creaks and warnings

### 🎨 Visual Design
- **Bioluminescent Aesthetic**: Custom cyan (#00FFD1), amber (#FFB347), and abyssal black (#050A0E) color scheme
- **Particle System**: Canvas-based marine snow and bioluminescent particle effects
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Custom Cursor**: Styled bioluminescent ring cursor for enhanced immersion
- **Darkness Overlay**: Dynamic depth-based darkness effect
- **Glowing Effects**: CSS-based bioluminescent glow and pulse animations

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **shadcn/ui**: Component library built on Radix UI

### Backend & Data
- **Prisma**: Modern ORM for database management
- **SQLite**: Lightweight relational database

### Interactive Libraries
- **@dnd-kit**: Drag-and-drop functionality for sortable lists
- **@tanstack/react-query**: Server state management
- **@mdxeditor/editor**: Rich text editing capabilities
- **Radix UI Components**: Accessible UI primitives including:
  - Accordion, Alert Dialog, Avatar, Checkbox, Collapsible
  - Dialog, Dropdown Menu, Hover Card, Label, Menubar
  - Navigation Menu, Popover, Progress, Radio Group
  - Scroll Area, Select, Separator, Slider, Switch
  - Tabs, Toggle, Toggle Group, Tooltip

### Audio & Visualization
- **Web Audio API**: Real-time sound synthesis and processing
- **Canvas API**: Particle system rendering
- **Waveform Visualization**: Audio spectrum display

---

## 📋 Prerequisites

- **Node.js** 18.17 or higher
- **npm** or **yarn** or **bun** (package manager)
- **SQLite** (for database)

---

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd deep-ocean-intelligence-archive
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
bun install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```bash
DATABASE_URL="file:./dev.db"
```

### 4. Initialize the Database
```bash
npm run db:generate
npm run db:push
```

---

## 🚀 Getting Started

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Database Management
```bash
# Push schema changes to the database
npm run db:push

# Generate Prisma Client
npm run db:generate

# Create a new migration
npm run db:migrate

# Reset the database (warning: deletes all data)
npm run db:reset
```

### Linting
```bash
npm run lint
```

---

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Reusable React components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions and helpers
├── prisma/
│   └── schema.prisma       # Database schema definition
├── public/                 # Static assets
├── skills/                 # AI skills and capabilities
├── download/               # Download utilities
├── examples/               # Example implementations
│   └── websocket/         # WebSocket examples
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── Caddyfile             # Web server configuration
```

---

## 🎯 Core Features In Detail

### Depth Tracking System
The application tracks your scrolling position to simulate descent through ocean zones. As you move deeper:
- Darkness increases with custom CSS overlays
- Pressure and temperature values update in real-time
- HUD (Heads-Up Display) shows vital metrics
- Creatures and features appropriate to each depth zone appear

### Submarine Light Effect
A radial gradient follows your cursor, simulating a submarine's spotlight. This reveals:
- Creature details in complete darkness
- Hidden oceanic features
- Bioluminescent organisms
- Environmental hazards

### Creature Database
- 16 unique deep-sea creatures
- Species profiles with characteristics
- Bioluminescence toggles for visualization
- Distribution across depth zones
- Scientific information and adaptations

### Conservation Tracking
- Real-time species discovery log
- Progress bars showing collection percentage
- Educational content about ocean conservation
- Threat visualization for endangered ecosystems

---

## 🔌 API & Data Models

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Post Model
```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🎨 Customization

### Color Scheme
Modify the bioluminescent colors in your Tailwind configuration:
- Primary Cyan: `#00FFD1`
- Accent Amber: `#FFB347`
- Abyssal Black: `#050A0E`

### Depth Zones
Customize zone boundaries, creature distributions, and visual effects in the data configuration files.

### Sound Effects
Adjust Web Audio API parameters for:
- Sonar ping frequency and amplitude
- Ambient hum tone and volume
- Whale song synthesis
- Bubble particle sounds

---

## 📊 Performance Optimization

- **Standalone Build**: Optimized for production deployment with static asset bundling
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Particle System**: Canvas-based rendering for efficient animations
- **React Query**: Efficient data fetching and caching

---

## 🧪 Testing

Run linting to check code quality:
```bash
npm run lint
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🐛 Known Issues & Limitations

- Some audio effects may be limited on certain browsers
- WebSocket support requires specific setup (see `/examples/websocket/`)
- Mobile responsiveness optimized for screens 320px and above

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 💬 Support

For questions, bug reports, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review the worklog for implementation details

---

## 🌍 About Deep-Sea Exploration

The Deep Ocean Intelligence Archive celebrates humanity's exploration of Earth's final frontier. The ocean depths remain largely unexplored, yet they harbor remarkable biodiversity and geological phenomena. This project aims to inspire curiosity about our planet's oceans and the importance of marine conservation.

---

**Built with ❤️ and 🌊 exploration spirit**

*Last Updated: April 2026*

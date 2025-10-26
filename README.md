# QuickShare - Simple Text Sharing

A clean, anonymous pastebin-like service built with Next.js and Firebase. Share text snippets quickly with readable URLs and QR codes.

## Features

- 🔗 **Readable URLs**: Get memorable links like `/wise-fox-82` instead of random strings
- 📱 **QR Code Sharing**: Automatically generated QR codes for easy mobile sharing
- 🔒 **Anonymous**: No registration required
- ⚡ **Fast**: Built with Next.js for optimal performance
- 📱 **Responsive**: Works perfectly on desktop and mobile
- 🎯 **Simple**: Clean, minimalist interface focused on usability

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Firebase Firestore
- **Hosting**: Vercel (recommended)
- **QR Codes**: react-qr-code

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings > General > Your apps
5. Add a web app and copy the configuration

### 3. Environment Variables

1. Copy the environment template:
```bash
cp .env.local.example .env.local
```

2. Fill in your Firebase configuration in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules

In your Firebase Console, go to Firestore Database > Rules and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pastes/{document} {
      allow read: if true;
      allow create: if true;
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Project Structure

```
src/
├── app/
│   ├── [slug]/          # Dynamic route for viewing pastes
│   │   └── page.tsx
│   ├── api/
│   │   ├── create/      # API route for creating pastes
│   │   │   └── route.ts
│   │   └── paste/[slug]/ # API route for fetching pastes
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx         # Main page with text input
└── lib/
    ├── firebase.ts      # Firebase configuration
    ├── generateId.ts    # Readable URL generator
    └── utils.ts         # Utility functions
```

## API Endpoints

### POST /api/create
Creates a new paste.

**Request:**
```json
{
  "content": "Your text content here"
}
```

**Response:**
```json
{
  "slug": "wise-fox-82"
}
```

### GET /api/paste/[slug]
Retrieves a paste by its slug.

**Response:**
```json
{
  "content": "The paste content",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Configuration

### Text Limits
- Maximum characters: 50,000 (configurable in `src/app/page.tsx`)

### URL Generation
- Format: `{adjective}-{noun}-{number}`
- Example: `wise-fox-82`, `quick-ocean-99`
- Collision handling with automatic retry

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

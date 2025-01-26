# NAVADA - Advanced AI Chat Interface

A powerful multi-model AI chat interface supporting both Anthropic's Claude and Google's Gemini, designed for data analysis and machine learning tasks.

## Features

- 🤖 Multi-model AI Support
  - Anthropic Claude 3.5 Sonnet
  - Google Gemini Pro
- 📊 Advanced Data Analysis Capabilities
  - Statistical analysis and visualization
  - Machine learning model recommendations
  - Hypothesis testing and statistical inference
- 💫 Modern UI/UX
  - Beautiful interface with smooth animations
  - Fully responsive design
  - System message configuration
- 📁 Data Management
  - Export chat history
  - Import attachments
  - Persistent conversations

## Tech Stack

- **Frontend**: React, TypeScript, ShadcnUI
- **Backend**: Express, Node.js
- **AI Integration**: 
  - Anthropic Claude API
  - Google Gemini API
- **Styling**: Tailwind CSS

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/leeakpareva/agentlang.git
cd agentlang
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables by creating a `.env` file:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Environment Variables

The following environment variables are required:

- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude
- `GEMINI_API_KEY`: Your Google API key for Gemini

## Usage

1. **Chat Interface**: Start a conversation by typing your message in the input field
2. **Switch AI Models**: Use the settings menu to switch between Claude and Gemini
3. **Custom System Messages**: Configure custom AI personalities and behaviors
4. **Export/Import**: 
   - Export your chat history as JSON
   - Import previous conversations or attachments

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
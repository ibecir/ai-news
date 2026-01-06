#!/bin/bash

echo "🧪 Setting up testing environment for the project..."
echo ""

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

echo "📦 Installing testing dependencies..."
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Testing dependencies installed successfully!"
    echo ""
    echo "🎉 Setup complete! You can now:"
    echo "   - Run tests: npm test"
    echo "   - Run tests with UI: npm test:ui"
    echo "   - Run tests with coverage: npm test:coverage"
    echo ""
    echo "📚 See TESTING_SETUP.md for more information"
    echo ""
    echo "🚀 Try running the tests now: npm test"
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi

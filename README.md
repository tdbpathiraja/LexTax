# LexTax - Sri Lankan Tax AI Assistant

**LexTax** is an intelligent conversational AI system designed to provide human-like responses to Sri Lankan tax queries. The system uses advanced neural networks to generate natural, accessible explanations of complex tax concepts, making Sri Lankan tax laws understandable for everyday users.

## 🚀 Features

- **Conversational AI**: Natural language processing for tax-related queries
- **Human-like Responses**: Generates explanations in simple, understandable language
- **Domain-Specific**: Specialized for Sri Lankan tax laws and regulations
- **Real-time Processing**: Fast response times (<3 seconds)
- **Multi-turn Conversations**: Maintains context throughout conversations
- **Government Verified**: Based on official IRD (Inland Revenue Department) information
- **Universal Deployment**: Self-contained model with no external dependencies

## 🏗️ System Architecture


### Technology Stack

**Frontend:**
- React.js
- JavaScript
- CSS3 with responsive design
- React Icons
- React Hot Toast

**Backend:**
- Python 3.7+
- Flask web framework
- RESTful API architecture
- PyTorch/Transformers
- Self-contained pickle model

**AI Model:**
- Fine-tuned T5 transformer
- Domain-specific training on Sri Lankan tax data
- Sequence-to-sequence architecture with attention mechanism
- Response confidence scoring

## 📋 Prerequisites

Before running the system, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Python** (3.7 or higher)
- **pip** (Python package manager)
- **Git**

### System Requirements

- **RAM**: 4-8GB (for model inference)
- **Storage**: 2GB free space
- **Internet**: Required for initial setup only

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/tdbpathiraja/LexTax.git

cd LexTax
```

### 2. Backend Setup

#### Create Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### Install Backend Dependencies

```bash
# Install from requirements.txt
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## 🚀 Running the System

### 1. Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if not already activated)
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows

# Set environment variables (optional)
export FLASK_ENV=development
export FLASK_DEBUG=True

# Start Flask server
python app.py
```

The backend server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Start React development server
npm run dev
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

### Manual Testing

1. **Start both servers** (backend and frontend)
2. **Open browser** to `http://localhost:3000`
3. **Test queries:**
   - "What is the income tax rate for individuals?"
   - "How do I calculate VAT for my business?"
   - "What are the deadlines for tax filing?"
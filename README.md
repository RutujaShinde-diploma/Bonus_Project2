# LM Agent Proof-of-Concept (POC): Browser-Based Multi-Tool Reasoning

A minimal JavaScript-based LLM agent that demonstrates multi-tool reasoning capabilities in the browser.

## 🚀 Quick Start

1. **Open the project**: Simply open `index.html` in your web browser
2. **No build process required** - it's pure HTML/JS/CSS
3. **Start chatting** - the agent will respond and use tools as needed

## 🎯 Project Overview

This POC demonstrates how modern LLM-powered agents can combine text generation with external tools:

- **Google Search**: Get real-time information from the web
- **AI Pipe API**: Process data through AI workflows  
- **JavaScript Execution**: Run code safely in the browser
- **Tool Calling Loop**: Agent decides when and how to use tools

## 🛠️ Core Architecture

The agent follows this reasoning loop (mimicking the Python reference):

```javascript
async loop(userInput) {
    // 1. Take user input
    this.conversation.push({ role: "user", content: userInput });
    
    while (true) {
        // 2. Query LLM for output + potential tool calls
        const response = await this.callLLM(this.conversation, this.tools);
        
        // 3. Display LLM output
        this.displayMessage("Agent", response.content, "agent-message");
        
        // 4. Execute tool calls if any
        if (response.tool_calls && response.tool_calls.length > 0) {
            for (const toolCall of response.tool_calls) {
                const result = await this.handleToolCall(toolCall);
                // Add tool results to conversation
            }
        } else {
            // 5. No more tools needed, break loop
            break;
        }
    }
}
```

## 🔧 Available Tools

### 1. Google Search (`google_search`)
- **Purpose**: Get current information from the web
- **Implementation**: Uses DuckDuckGo Instant Answer API (free, no key required)
- **Usage**: Ask the agent to "search for [topic]" or "find information about [subject]"

### 2. AI Pipe API (`ai_pipe`)
- **Purpose**: Process data through AI workflows
- **Implementation**: Mock API that simulates AI processing
- **Usage**: Ask the agent to "analyze [data]" or "process [information]"

### 3. JavaScript Execution (`execute_js`)
- **Purpose**: Run JavaScript code safely in the browser
- **Implementation**: Sandboxed execution using Function constructor
- **Usage**: Ask the agent to "calculate [expression]" or "run [code]"

## 💬 Example Conversations

### Search Example
```
You: Search for information about artificial intelligence
Agent: I'll search for information about "artificial intelligence".
Search Result: Search results for "artificial intelligence": [Results from DuckDuckGo API]
```

### Analysis Example
```
You: Analyze this text: "The weather is sunny today"
Agent: I'll analyze this data using the AI Pipe API.
AI Pipe Result: AI Analysis Result: Processed "The weather is sunny today" with sentiment analysis and key insights.
```

### Code Execution Example
```
You: Calculate 2 + 2
Agent: I'll execute some JavaScript code to help with this.
JS Execution Result: Code executed successfully. Result: 4
```

## 🎨 UI Features

- **Bootstrap 5**: Modern, responsive design
- **Real-time Chat**: Live conversation interface
- **Tool Status**: Visual indicators for available tools
- **Error Handling**: Graceful error display with modals
- **Loading States**: Visual feedback during processing

## 🔒 Security Features

- **Sandboxed JS Execution**: Code runs in isolated Function context
- **Input Validation**: Sanitized user inputs
- **Error Boundaries**: Graceful error handling and display

## 🚧 Current Limitations

- **Mock LLM**: Currently uses rule-based responses instead of real LLM API
- **Basic Tool Logic**: Simple keyword-based tool selection
- **Limited Context**: Basic conversation memory

## 🔮 Future Enhancements

- **Real LLM Integration**: Connect to OpenAI, Anthropic, or other APIs
- **Advanced Tool Selection**: Use actual LLM reasoning for tool choice
- **Enhanced Memory**: Better conversation context and history
- **More Tools**: Add file processing, API integrations, etc.
- **Streaming**: Real-time response streaming

## 🧪 Testing

1. **Basic Functionality**: Try asking the agent to search, analyze, or calculate
2. **Tool Integration**: Verify that tools are called appropriately
3. **Error Handling**: Test with invalid inputs or network issues
4. **UI Responsiveness**: Check on different screen sizes

## 📁 File Structure

```
Bonus_P2/
├── index.html          # Main HTML interface
├── agent.js            # Core agent logic and tools
└── README.md           # This file
```

## 🎯 Success Criteria

✅ **Browser-based agent** - Pure HTML/JS implementation  
✅ **LLM conversation window** - Real-time chat interface  
✅ **Three working tools** - Search, AI Pipe, JS execution  
✅ **OpenAI-style tool calling** - Function-based tool definitions  
✅ **Error handling** - Bootstrap alerts for errors  
✅ **Minimal code** - Easy to understand and extend  

## 🚀 Getting Started

1. Clone or download this project
2. Open `index.html` in your browser
3. Start chatting with the agent!
4. Try asking it to use different tools

## 🤝 Contributing

This is a proof-of-concept project. Feel free to:
- Extend the tool set
- Improve the UI/UX
- Add real LLM API integration
- Enhance the reasoning logic

## 📄 License

This project is open source and available under the MIT License.

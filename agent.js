// LM Agent POC - Core Agent Logic
class LMAgent {
    constructor() {
        this.conversation = [];
        this.tools = [
            {
                type: "function",
                function: {
                    name: "google_search",
                    description: "Search Google for current information",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "Search query"
                            }
                        },
                        required: ["query"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "ai_pipe",
                    description: "Use AI Pipe API for data processing",
                    parameters: {
                        type: "object",
                        properties: {
                            operation: {
                                type: "string",
                                description: "Operation to perform (analyze, summarize, etc.)"
                            },
                            data: {
                                type: "string",
                                description: "Data to process"
                            }
                        },
                        required: ["operation", "data"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "execute_js",
                    description: "Execute JavaScript code safely in the browser",
                    parameters: {
                        type: "object",
                        properties: {
                            code: {
                                type: "string",
                                description: "JavaScript code to execute"
                            }
                        },
                        required: ["code"]
                    }
                }
            }
        ];
    }

    // Main agent loop - mimics the Python logic
    async loop(userInput) {
        this.conversation.push({ role: "user", content: userInput });
        
        while (true) {
            try {
                // Get LLM response with potential tool calls
                const response = await this.callLLM(this.conversation, this.tools);
                
                // Display agent output
                this.displayMessage("Agent", response.content, "agent-message");
                
                // Handle tool calls if any
                if (response.tool_calls && response.tool_calls.length > 0) {
                    for (const toolCall of response.tool_calls) {
                        const result = await this.handleToolCall(toolCall);
                        this.conversation.push({
                            role: "tool",
                            content: result,
                            tool_call_id: toolCall.id
                        });
                    }
                } else {
                    // No more tool calls, break the loop
                    break;
                }
            } catch (error) {
                this.showError("Agent loop error: " + error.message);
                break;
            }
        }
    }

    // Call LLM with tool definitions
    async callLLM(messages, tools) {
        const apiKey = document.getElementById('apiKey').value;
        const model = document.getElementById('modelSelect').value;
        
        if (!apiKey) {
            throw new Error("Please enter your API key");
        }

        // For demo purposes, we'll use a mock response that simulates tool calling
        // In production, this would call the actual LLM API
        return await this.mockLLMResponse(messages, tools);
    }

    // Mock LLM response for demo - simulates tool calling behavior
    async mockLLMResponse(messages, tools) {
        const lastMessage = messages[messages.length - 1];
        const content = lastMessage.content.toLowerCase();
        
        // Simple rule-based tool calling for demo
        if (content.includes('search') || content.includes('find') || content.includes('look up')) {
            const query = content.replace(/search|find|look up/gi, '').trim();
            return {
                content: `I'll search for information about "${query}".`,
                tool_calls: [{
                    id: "search_" + Date.now(),
                    type: "function",
                    function: {
                        name: "google_search",
                        arguments: JSON.stringify({ query: query })
                    }
                }]
            };
        } else if (content.includes('analyze') || content.includes('process')) {
            return {
                content: "I'll analyze this data using the AI Pipe API.",
                tool_calls: [{
                    id: "ai_" + Date.now(),
                    type: "function",
                    function: {
                        name: "ai_pipe",
                        arguments: JSON.stringify({ 
                            operation: "analyze", 
                            data: lastMessage.content 
                        })
                    }
                }]
            };
        } else if (content.includes('calculate') || content.includes('compute') || content.includes('run')) {
            return {
                content: "I'll execute some JavaScript code to help with this.",
                tool_calls: [{
                    id: "js_" + Date.now(),
                    type: "function",
                    function: {
                        name: "execute_js",
                        arguments: JSON.stringify({ 
                            code: "console.log('Hello from JS execution'); return 'Code executed successfully';" 
                        })
                    }
                }]
            };
        } else {
            return {
                content: "I understand. How can I help you further? You can ask me to search for information, analyze data, or execute code.",
                tool_calls: []
            };
        }
    }

    // Handle individual tool calls
    async handleToolCall(toolCall) {
        const functionName = toolCall.function.name;
        const arguments = JSON.parse(toolCall.function.arguments);
        
        try {
            let result;
            
            switch (functionName) {
                case "google_search":
                    result = await this.googleSearch(arguments.query);
                    this.displayMessage("Search Result", result, "search-result");
                    break;
                    
                case "ai_pipe":
                    result = await this.aiPipe(arguments.operation, arguments.data);
                    this.displayMessage("AI Pipe Result", result, "tool-result");
                    break;
                    
                case "execute_js":
                    result = await this.executeJS(arguments.code);
                    this.displayMessage("JS Execution Result", result, "code-execution");
                    break;
                    
                default:
                    result = `Unknown tool: ${functionName}`;
            }
            
            return result;
        } catch (error) {
            const errorMsg = `Tool execution error: ${error.message}`;
            this.showError(errorMsg);
            return errorMsg;
        }
    }

    // Google Search API (using a free search service)
    async googleSearch(query) {
        try {
            // Using DuckDuckGo Instant Answer API (free, no API key required)
            const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
            const data = await response.json();
            
            if (data.Abstract) {
                return `Search results for "${query}": ${data.Abstract}`;
            } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                return `Search results for "${query}": ${data.RelatedTopics[0].Text}`;
            } else {
                return `No specific results found for "${query}", but you can try a more specific search term.`;
            }
        } catch (error) {
            return `Search error: ${error.message}. You can try searching manually at duckduckgo.com`;
        }
    }

    // AI Pipe API (mock implementation)
    async aiPipe(operation, data) {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        switch (operation) {
            case "analyze":
                return `AI Analysis Result: Processed "${data.substring(0, 50)}..." with sentiment analysis and key insights.`;
            case "summarize":
                return `AI Summary: "${data.substring(0, 30)}..." - Key points extracted and condensed.`;
            default:
                return `AI Pipe processed "${operation}" operation on the provided data.`;
        }
    }

    // JavaScript code execution (sandboxed)
    async executeJS(code) {
        try {
            // Create a safe execution environment
            const safeEval = new Function('return (function() { ' + code + ' })()');
            const result = safeEval();
            
            if (result !== undefined) {
                return `Code executed successfully. Result: ${JSON.stringify(result)}`;
            } else {
                return "Code executed successfully (no return value).";
            }
        } catch (error) {
            return `JavaScript execution error: ${error.message}`;
        }
    }

    // Display messages in the chat
    displayMessage(sender, content, className) {
        const chatContainer = document.getElementById('chatContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${content}`;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Show errors
    showError(message) {
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        document.getElementById('errorMessage').textContent = message;
        errorModal.show();
    }
}

// Global agent instance
const agent = new LMAgent();

// UI Event Handlers
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // Display user message
    agent.displayMessage("You", message, "user-message");
    
    // Clear input and show loading
    userInput.value = '';
    sendButton.disabled = true;
    loadingSpinner.classList.add('show');
    
    try {
        // Start agent loop
        await agent.loop(message);
    } catch (error) {
        agent.showError("Failed to process message: " + error.message);
    } finally {
        // Reset UI
        sendButton.disabled = false;
        loadingSpinner.classList.remove('show');
    }
}

// Initialize the agent when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('LM Agent POC loaded successfully!');
    console.log('Available tools:', agent.tools.map(t => t.function.name));
});

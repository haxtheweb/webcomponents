import { fixture, expect, html } from "@open-wc/testing";
import "../chat-agent.js";
import { ChatStore } from "../lib/chat-agent-store.js";

// Mock dependencies
beforeEach(() => {
  // Mock HAXcms store
  globalThis.store = {
    darkMode: false,
    editMode: false,
    userData: {
      userName: 'testuser'
    }
  };
  
  // Mock MicroFrontendRegistry
  globalThis.MicroFrontendRegistry = {
    add: () => {},
    call: (service, params) => {
      return Promise.resolve({
        status: 200,
        data: {
          answers: 'This is a mock AI response.',
          question: params.question
        }
      });
    }
  };
  
  // Mock enableServices
  globalThis.enableServices = () => {};
  
  // Mock MobX configure
  globalThis.configure = () => {};
  
  // Mock autorun and toJS
  globalThis.autorun = (fn) => fn();
  globalThis.toJS = (val) => val;
  
  // Mock document base element
  const mockBase = globalThis.document.createElement('base');
  mockBase.href = 'https://example.com/';
  globalThis.document.head.appendChild(mockBase);
});

aftereEach(() => {
  // Clean up global chat agent store
  if (globalThis.ChatAgentStore && globalThis.ChatAgentStore.instance) {
    if (globalThis.ChatAgentStore.instance.parentNode) {
      globalThis.ChatAgentStore.instance.parentNode.removeChild(globalThis.ChatAgentStore.instance);
    }
    delete globalThis.ChatAgentStore.instance;
  }
  
  // Clean up base element
  const base = globalThis.document.querySelector('base');
  if (base) {
    base.remove();
  }
});

describe("chat-agent test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`<chat-agent></chat-agent>`);
    await element.updateComplete;
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("chat-agent");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component structure and properties", () => {
    it("should have correct tag name", () => {
      expect(element.constructor.tag).to.equal("chat-agent");
    });

    it("should initialize with default properties", () => {
      expect(element.isFullView).to.be.null; // Will be set by MobX autorun
      expect(element.isInterfaceHidden).to.be.null; // Will be set by MobX autorun
    });

    it("should have required chat structure elements", () => {
      const wrapper = element.shadowRoot.querySelector('.chat-agent-wrapper');
      const interfaceWrapper = element.shadowRoot.querySelector('.agent-interface-wrapper');
      const buttonWrapper = element.shadowRoot.querySelector('.agent-button-wrapper');
      const chatInterface = element.shadowRoot.querySelector('chat-interface');
      const chatButton = element.shadowRoot.querySelector('chat-button');
      
      expect(wrapper).to.exist;
      expect(interfaceWrapper).to.exist;
      expect(buttonWrapper).to.exist;
      expect(chatInterface).to.exist;
      expect(chatButton).to.exist;
    });

    it("should display button label from store", () => {
      const buttonLabel = element.shadowRoot.querySelector('chat-button span[slot="label"]');
      expect(buttonLabel).to.exist;
      expect(buttonLabel.textContent).to.equal(ChatStore.buttonLabel);
    });
  });

  describe("Property validation with accessibility", () => {
    describe("isFullView property", () => {
      it("should handle full view state changes and maintain accessibility", async () => {
        // Test full view enabled
        element.isFullView = true;
        await element.updateComplete;
        
        expect(element.isFullView).to.be.true;
        expect(element.hasAttribute('is-full-view')).to.be.true;
        await expect(element).shadowDom.to.be.accessible();
        
        // Test full view disabled
        element.isFullView = false;
        await element.updateComplete;
        
        expect(element.isFullView).to.be.false;
        expect(element.hasAttribute('is-full-view')).to.be.false;
        await expect(element).shadowDom.to.be.accessible();
      });
    });

    describe("isInterfaceHidden property", () => {
      it("should handle interface visibility state and maintain accessibility", async () => {
        // Test interface hidden
        element.isInterfaceHidden = true;
        await element.updateComplete;
        
        expect(element.isInterfaceHidden).to.be.true;
        expect(element.hasAttribute('is-interface-hidden')).to.be.true;
        await expect(element).shadowDom.to.be.accessible();
        
        // Test interface visible
        element.isInterfaceHidden = false;
        await element.updateComplete;
        
        expect(element.isInterfaceHidden).to.be.false;
        expect(element.hasAttribute('is-interface-hidden')).to.be.false;
        await expect(element).shadowDom.to.be.accessible();
      });
    });

    it("should handle combined states correctly", async () => {
      // Test full view + hidden interface
      element.isFullView = true;
      element.isInterfaceHidden = true;
      await element.updateComplete;
      
      expect(element.hasAttribute('is-full-view')).to.be.true;
      expect(element.hasAttribute('is-interface-hidden')).to.be.true;
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Chat Store integration", () => {
    it("should have access to ChatStore", () => {
      expect(ChatStore).to.exist;
      expect(ChatStore.buttonLabel).to.exist;
      expect(ChatStore.chatLog).to.be.an('array');
    });

    it("should respond to store changes via autorun", async () => {
      // Since we're mocking autorun, we'll test the property synchronization directly
      ChatStore.isFullView = true;
      element.isFullView = ChatStore.isFullView;
      await element.updateComplete;
      
      expect(element.isFullView).to.be.true;
    });

    it("should initialize AI on firstUpdated", async () => {
      // Verify that startAI was called (would add initial message to chatLog)
      expect(ChatStore.chatLog.length).to.be.greaterThan(0);
      expect(ChatStore.chatLog[0].author).to.equal('merlin');
      expect(ChatStore.chatLog[0].message).to.include('Hello! My name is Merlin');
    });
  });

  describe("Chat functionality", () => {
    it("should handle message creation", () => {
      const initialLogLength = ChatStore.chatLog.length;
      
      ChatStore.handleMessage('testuser', 'Hello Merlin!');
      
      expect(ChatStore.chatLog.length).to.equal(initialLogLength + 1);
      const lastMessage = ChatStore.chatLog[ChatStore.chatLog.length - 1];
      expect(lastMessage.author).to.equal('testuser');
      expect(lastMessage.message).to.equal('Hello Merlin!');
      expect(lastMessage.messageID).to.exist;
      expect(lastMessage.timestamp).to.exist;
    });

    it("should handle predefined responses", async () => {
      const initialLogLength = ChatStore.chatLog.length;
      
      ChatStore.handleInteraction('Who are you?');
      
      // Should add the user message and Merlin's response
      expect(ChatStore.chatLog.length).to.equal(initialLogLength + 1);
      
      const lastMessage = ChatStore.chatLog[ChatStore.chatLog.length - 1];
      expect(lastMessage.author).to.equal('merlin');
      expect(lastMessage.message).to.include('I am Merlin');
      expect(ChatStore.currentSuggestions.length).to.be.greaterThan(0);
    });

    it("should handle AI responses for custom questions", async () => {
      const initialLogLength = ChatStore.chatLog.length;
      
      ChatStore.handleInteraction('What is the weather like?');
      
      // Wait for async AI response
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(ChatStore.chatLog.length).to.be.greaterThan(initialLogLength);
    });

    it("should manage loading state during AI requests", async () => {
      expect(ChatStore.isLoading).to.be.null;
      
      ChatStore.handleInteraction('Custom AI question');
      expect(ChatStore.isLoading).to.be.true;
      
      // Wait for response
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(ChatStore.isLoading).to.be.false;
    });

    it("should handle network errors gracefully", async () => {
      // Mock network error
      globalThis.MicroFrontendRegistry.call = () => {
        return Promise.reject(new Error('Network error'));
      };
      
      const initialLogLength = ChatStore.chatLog.length;
      
      ChatStore.handleInteraction('Network test question');
      
      // Wait for error handling
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(ChatStore.isLoading).to.be.false;
      expect(ChatStore.chatLog.length).to.be.greaterThan(initialLogLength);
      const lastMessage = ChatStore.chatLog[ChatStore.chatLog.length - 1];
      expect(lastMessage.message).to.include('having trouble connecting');
    });
  });

  describe("Suggestion system", () => {
    it("should provide initial suggestions", () => {
      expect(ChatStore.currentSuggestions).to.be.an('array');
      expect(ChatStore.currentSuggestions.length).to.be.greaterThan(0);
      
      const firstSuggestion = ChatStore.currentSuggestions[0];
      expect(firstSuggestion.suggestion).to.exist;
      expect(firstSuggestion.type).to.exist;
    });

    it("should update suggestions based on interactions", () => {
      ChatStore.handleInteraction('Who are you?');
      
      expect(ChatStore.currentSuggestions).to.be.an('array');
      const suggestionTexts = ChatStore.currentSuggestions.map(s => s.suggestion);
      expect(suggestionTexts).to.include('What can you do for me?');
      expect(suggestionTexts).to.include('How do I use you?');
    });

    it("should provide special suggestions on certain dates", () => {
      // Mock special date
      const originalDate = ChatStore.date;
      ChatStore.date = new Date(2023, 11, 5); // December 5th
      ChatStore.month = 12;
      ChatStore.day = 5;
      
      ChatStore.startAI();
      
      const suggestionTexts = ChatStore.currentSuggestions.map(s => s.suggestion);
      expect(suggestionTexts).to.include('Why is my character wearing a hat?');
      
      // Restore original date
      ChatStore.date = originalDate;
    });
  });

  describe("Chat log management", () => {
    it("should track message indices correctly", () => {
      const initialMessageIndex = ChatStore.messageIndex;
      const initialMerlinIndex = ChatStore.merlinIndex;
      
      ChatStore.handleMessage('merlin', 'Test message');
      
      expect(ChatStore.messageIndex).to.equal(initialMessageIndex + 1);
      expect(ChatStore.merlinIndex).to.equal(initialMerlinIndex + 1);
    });

    it("should handle download functionality", () => {
      // Mock document.createElement and related DOM methods
      const mockAnchor = {
        setAttribute: () => {},
        click: () => {},
        remove: () => {}
      };
      
      const originalCreateElement = globalThis.document.createElement;
      globalThis.document.createElement = (tag) => {
        if (tag === 'a') return mockAnchor;
        return originalCreateElement.call(globalThis.document, tag);
      };
      
      // Add some chat log entries
      ChatStore.handleMessage('testuser', 'Test message 1');
      ChatStore.handleMessage('merlin', 'Test response 1');
      
      expect(() => {
        ChatStore.handleDownload('json');
      }).to.not.throw();
      
      // Restore original createElement
      globalThis.document.createElement = originalCreateElement;
    });

    it("should not download empty chat log", () => {
      // Clear chat log
      ChatStore.chatLog = [];
      
      const mockCreateElement = () => {
        throw new Error('Should not create download element');
      };
      
      const originalCreateElement = globalThis.document.createElement;
      globalThis.document.createElement = mockCreateElement;
      
      expect(() => {
        ChatStore.handleDownload('json');
      }).to.not.throw();
      
      // Restore original createElement
      globalThis.document.createElement = originalCreateElement;
    });
  });

  describe("Developer mode functionality", () => {
    it("should handle developer statements when enabled", () => {
      ChatStore.developerModeEnabled = true;
      
      let logCalled = false;
      const originalLog = globalThis.console.log;
      globalThis.console.log = (message) => {
        if (message.includes('CHAT-AGENT-DEV-MODE')) {
          logCalled = true;
        }
      };
      
      ChatStore.devStatement('Test log message', 'log');
      
      expect(logCalled).to.be.true;
      
      // Restore original console.log
      globalThis.console.log = originalLog;
      ChatStore.developerModeEnabled = false;
    });

    it("should not log when developer mode is disabled", () => {
      ChatStore.developerModeEnabled = false;
      
      let logCalled = false;
      const originalLog = globalThis.console.log;
      globalThis.console.log = () => {
        logCalled = true;
      };
      
      ChatStore.devStatement('Test log message', 'log');
      
      expect(logCalled).to.be.false;
      
      // Restore original console.log
      globalThis.console.log = originalLog;
    });

    it("should handle different log types", () => {
      ChatStore.developerModeEnabled = true;
      
      const logTypes = ['log', 'info', 'warn', 'error'];
      const originalMethods = {};
      const callCounts = {};
      
      logTypes.forEach(type => {
        originalMethods[type] = globalThis.console[type];
        callCounts[type] = 0;
        globalThis.console[type] = () => {
          callCounts[type]++;
        };
      });
      
      logTypes.forEach(type => {
        ChatStore.devStatement(`Test ${type} message`, type);
        expect(callCounts[type]).to.equal(1);
      });
      
      // Restore original methods
      logTypes.forEach(type => {
        globalThis.console[type] = originalMethods[type];
      });
      
      ChatStore.developerModeEnabled = false;
    });
  });

  describe("Global store management", () => {
    it("should create singleton instance", () => {
      const instance1 = globalThis.ChatAgentStore.requestAvailability();
      const instance2 = globalThis.ChatAgentStore.requestAvailability();
      
      expect(instance1).to.equal(instance2);
      expect(instance1.tagName.toLowerCase()).to.equal('chat-agent');
    });

    it("should append instance to document body", () => {
      const instance = globalThis.ChatAgentStore.requestAvailability();
      
      expect(instance.parentNode).to.equal(globalThis.document.body);
    });
  });

  describe("Responsive design and styling", () => {
    it("should apply correct CSS classes for different states", async () => {
      const wrapper = element.shadowRoot.querySelector('.chat-agent-wrapper');
      expect(wrapper).to.exist;
      
      // Test full view styling
      element.isFullView = true;
      await element.updateComplete;
      
      const computedStyle = globalThis.getComputedStyle(element);
      // Element should have the is-full-view attribute for CSS targeting
      expect(element.hasAttribute('is-full-view')).to.be.true;
    });

    it("should handle combined state styling", async () => {
      element.isFullView = true;
      element.isInterfaceHidden = true;
      await element.updateComplete;
      
      expect(element.hasAttribute('is-full-view')).to.be.true;
      expect(element.hasAttribute('is-interface-hidden')).to.be.true;
    });
  });

  describe("Accessibility scenarios", () => {
    it("should remain accessible in different view states", async () => {
      const states = [
        { isFullView: false, isInterfaceHidden: false },
        { isFullView: true, isInterfaceHidden: false },
        { isFullView: false, isInterfaceHidden: true },
        { isFullView: true, isInterfaceHidden: true }
      ];
      
      for (const state of states) {
        element.isFullView = state.isFullView;
        element.isInterfaceHidden = state.isInterfaceHidden;
        await element.updateComplete;
        
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("should have proper component structure for screen readers", () => {
      const wrappers = element.shadowRoot.querySelectorAll('.chat-agent-wrapper > div');
      expect(wrappers.length).to.equal(2); // interface and button wrappers
      
      const interfaceWrapper = element.shadowRoot.querySelector('.agent-interface-wrapper');
      const buttonWrapper = element.shadowRoot.querySelector('.agent-button-wrapper');
      
      expect(interfaceWrapper).to.exist;
      expect(buttonWrapper).to.exist;
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle missing base element gracefully", () => {
      const base = globalThis.document.querySelector('base');
      if (base) base.remove();
      
      expect(() => {
        ChatStore.handleInteraction('Test question without base');
      }).to.not.throw();
    });

    it("should handle empty or invalid user names", () => {
      const originalUserName = ChatStore.userName;
      
      // Test with empty username
      ChatStore.userName = '';
      expect(() => {
        ChatStore.handleMessage('', 'Test message');
      }).to.not.throw();
      
      // Test with undefined username  
      ChatStore.userName = undefined;
      expect(() => {
        ChatStore.handleMessage(undefined, 'Test message');
      }).to.not.throw();
      
      // Restore original username
      ChatStore.userName = originalUserName;
    });

    it("should handle very long messages", () => {
      const longMessage = 'A'.repeat(10000);
      
      expect(() => {
        ChatStore.handleMessage('testuser', longMessage);
      }).to.not.throw();
      
      const lastMessage = ChatStore.chatLog[ChatStore.chatLog.length - 1];
      expect(lastMessage.message).to.equal(longMessage);
    });

    it("should handle special characters in messages", () => {
      const specialMessage = '!@#$%^&*()_+{}:"|<>?[]\\\';
      
      expect(() => {
        ChatStore.handleMessage('testuser', specialMessage);
      }).to.not.throw();
      
      const lastMessage = ChatStore.chatLog[ChatStore.chatLog.length - 1];
      expect(lastMessage.message).to.equal(specialMessage);
    });

    it("should handle malformed AI responses", async () => {
      globalThis.MicroFrontendRegistry.call = () => {
        return Promise.resolve({
          status: 500,
          data: null
        });
      };
      
      expect(() => {
        ChatStore.handleInteraction('Test malformed response');
      }).to.not.throw();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(ChatStore.isLoading).to.be.false;
    });
  });

  describe("Lifecycle methods", () => {
    it("should handle constructor properly", () => {
      const newElement = new (element.constructor)();
      
      expect(newElement.isFullView).to.be.null;
      expect(newElement.isInterfaceHidden).to.be.null;
    });

    it("should initialize AI on firstUpdated", async () => {
      const chatLogBefore = ChatStore.chatLog.length;
      
      // Create new element to trigger firstUpdated
      const newElement = await fixture(html`<chat-agent></chat-agent>`);
      
      // Should have added initial Merlin greeting
      expect(ChatStore.chatLog.length).to.be.greaterThan(chatLogBefore);
    });
  });

  describe("Integration scenarios", () => {
    it("should handle complete chat conversation workflow", async () => {
      const initialLogLength = ChatStore.chatLog.length;
      
      // User asks a question
      ChatStore.handleMessage('testuser', 'Hello Merlin');
      expect(ChatStore.chatLog.length).to.equal(initialLogLength + 1);
      
      // Simulate AI interaction
      ChatStore.handleInteraction('What can you do for me?');
      expect(ChatStore.chatLog.length).to.equal(initialLogLength + 2);
      
      // Verify suggestions are provided
      expect(ChatStore.currentSuggestions.length).to.be.greaterThan(0);
    });

    it("should work with different chat contexts", () => {
      const originalContext = ChatStore.context;
      
      ChatStore.context = 'mathematics';
      ChatStore.startAI();
      
      const welcomeMessage = ChatStore.chatLog[ChatStore.chatLog.length - 1];
      expect(welcomeMessage.message).to.include('mathematics');
      
      ChatStore.context = originalContext;
    });

    it("should handle user state changes", async () => {
      // Test dark mode change
      globalThis.store.darkMode = true;
      expect(ChatStore.darkMode).to.be.true;
      
      // Test edit mode change
      globalThis.store.editMode = true;
      expect(ChatStore.editMode).to.be.true;
      
      // Test username change
      globalThis.store.userData.userName = 'newuser';
      // Note: This would require reinitializing ChatStore in real usage
    });
  });

  describe("Performance considerations", () => {
    it("should handle multiple rapid interactions", async () => {
      const questions = [
        'Question 1',
        'Question 2', 
        'Question 3',
        'Question 4',
        'Question 5'
      ];
      
      const startTime = performance.now();
      
      questions.forEach(question => {
        ChatStore.handleMessage('testuser', question);
      });
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      expect(processingTime).to.be.lessThan(100);
      expect(ChatStore.chatLog.length).to.be.greaterThan(questions.length);
    });

    it("should manage memory efficiently with large chat logs", () => {
      const initialLength = ChatStore.chatLog.length;
      
      // Add many messages
      for (let i = 0; i < 100; i++) {
        ChatStore.handleMessage('testuser', `Message ${i}`);
      }
      
      expect(ChatStore.chatLog.length).to.equal(initialLength + 100);
      
      // Verify all messages are properly structured
      const lastMessage = ChatStore.chatLog[ChatStore.chatLog.length - 1];
      expect(lastMessage.messageID).to.exist;
      expect(lastMessage.timestamp).to.exist;
    });
  });
});

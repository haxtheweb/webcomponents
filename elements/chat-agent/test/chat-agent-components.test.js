import { fixture, expect, html, aTimeout } from '@open-wc/testing'
import '../chat-agent.js'
import { ChatStore } from '../lib/chat-agent-store.js'
import { MicroFrontendRegistry } from '@haxtheweb/micro-frontend-registry/micro-frontend-registry.js'

// captured at import time, before any beforeEach resets it, so the store
// constructor defaults can be regression tested
const initialPromptCharacterLimit = ChatStore.promptCharacterLimit

// Behavioral coverage for the chat-agent sub-components and store flows:
// button interactions, input keyboard navigation, control bar actions with
// confirm/alert stubs, developer panel, message hats/suggestions, suggestion
// icon types, interface scroll/resize behavior, and store AI interactions.
describe('chat-agent sub-components', () => {
  beforeEach(() => {
    ChatStore.chatLog = []
    ChatStore.currentSuggestions = []
    ChatStore.merlinIndex = 0
    ChatStore.messageIndex = 0
    ChatStore.userIndex = 0
    ChatStore.isLoading = null
    ChatStore.isFullView = false
    ChatStore.isInterfaceHidden = true
    ChatStore.developerModeEnabled = false
    ChatStore.dataCollectionEnabled = true
    ChatStore.engine = 'alfred'
    ChatStore.context = 'phys211'
    ChatStore.buttonIcon = 'hax:wizard-hat'
    ChatStore.userName = 'testuser'
    ChatStore.promptCharacterLimit = undefined
  })

  describe('chat-button', () => {
    it('keyPress Enter mimics active state and toggles the interface', async () => {
      const el = await fixture(html`<chat-button></chat-button>`)
      await aTimeout(0)
      await el.updateComplete
      expect(el.isInterfaceHidden).to.equal(true)
      el.keyPress(new KeyboardEvent('keypress', { key: 'Enter', cancelable: true }))
      const wrapper = el.shadowRoot.querySelector('.chat-button-wrapper')
      expect(wrapper.classList.contains('active-mimic')).to.equal(true)
      expect(ChatStore.isInterfaceHidden).to.equal(false)
      await aTimeout(150)
      expect(wrapper.classList.contains('active-mimic')).to.equal(false)
      ChatStore.isInterfaceHidden = true
    })

    it('keyPress ignores non-Enter keys', async () => {
      const el = await fixture(html`<chat-button></chat-button>`)
      await aTimeout(0)
      el.keyPress(new KeyboardEvent('keypress', { key: 'a', cancelable: true }))
      const wrapper = el.shadowRoot.querySelector('.chat-button-wrapper')
      expect(wrapper.classList.contains('active-mimic')).to.equal(false)
    })

    it('a real keydown on the wrapper activates via Enter only', async () => {
      // regression (a11y follow-up): the deprecated @keypress binding was
      // migrated to @keydown; only Enter activates the button
      const el = await fixture(html`<chat-button></chat-button>`)
      await aTimeout(0)
      const wrapper = el.shadowRoot.querySelector('.chat-button-wrapper')
      wrapper.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'a',
          bubbles: true,
          cancelable: true,
        }),
      )
      expect(ChatStore.isInterfaceHidden).to.equal(true)
      wrapper.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      )
      expect(ChatStore.isInterfaceHidden).to.equal(false)
      ChatStore.isInterfaceHidden = true
    })

    it('handleChatButton toggles interface visibility in the store', async () => {
      const el = await fixture(html`<chat-button></chat-button>`)
      await aTimeout(0)
      el.handleChatButton()
      expect(ChatStore.isInterfaceHidden).to.equal(false)
      // let the autorun re-sync el.isInterfaceHidden before toggling again
      await aTimeout(0)
      el.handleChatButton()
      expect(ChatStore.isInterfaceHidden).to.equal(true)
    })
  })

  describe('chat-input', () => {
    it('firstUpdated applies the prompt character limit', async () => {
      ChatStore.promptCharacterLimit = 10
      const el = await fixture(html`<chat-input></chat-input>`)
      const textarea = el.shadowRoot.querySelector('#user-input')
      expect(textarea.getAttribute('maxlength')).to.equal('10')
    })

    it('handleKeyPress Enter sends the typed prompt', async () => {
      const el = await fixture(html`<chat-input></chat-input>`)
      await aTimeout(0)
      const textarea = el.shadowRoot.querySelector('#user-input')
      textarea.value = 'Hello there'
      const before = ChatStore.chatLog.length
      el.handleKeyPress(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }))
      expect(ChatStore.chatLog.length).to.equal(before + 1)
      const last = ChatStore.chatLog[ChatStore.chatLog.length - 1]
      expect(last.author).to.equal('testuser')
      expect(last.message).to.equal('Hello there')
      expect(textarea.value).to.equal('')
    })

    it('handleSendButton does nothing for an empty prompt', async () => {
      const el = await fixture(html`<chat-input></chat-input>`)
      await aTimeout(0)
      const before = ChatStore.chatLog.length
      el.handleSendButton()
      expect(ChatStore.chatLog.length).to.equal(before)
    })

    it('handleSendButton warns when the prompt exceeds the character limit', async () => {
      const origAlert = globalThis.alert
      let alertText = null
      globalThis.alert = (t) => (alertText = t)
      ChatStore.promptCharacterLimit = 5
      const el = await fixture(html`<chat-input></chat-input>`)
      await aTimeout(0)
      el.shadowRoot.querySelector('#user-input').value = 'way too long prompt'
      el.handleSendButton()
      globalThis.alert = origAlert
      expect(alertText).to.contain('shorten your prompt')
      // the prompt is still sent despite the warning
      const last = ChatStore.chatLog[ChatStore.chatLog.length - 1]
      expect(last.message).to.equal('way too long prompt')
    })

    it('handleSendButtonKeyPress Enter sends and mimics active state', async () => {
      const el = await fixture(html`<chat-input></chat-input>`)
      await aTimeout(0)
      el.shadowRoot.querySelector('#user-input').value = 'via enter key'
      const before = ChatStore.chatLog.length
      el.handleSendButtonKeyPress(
        new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }),
      )
      const send = el.shadowRoot.querySelector('#send-button')
      expect(send.classList.contains('active-mimic')).to.equal(true)
      expect(ChatStore.chatLog.length).to.equal(before + 1)
      await aTimeout(150)
      expect(send.classList.contains('active-mimic')).to.equal(false)
    })

    it('handleDirectionButtons routes up and down by button id', async () => {
      const el = await fixture(html`<chat-input></chat-input>`)
      await aTimeout(0)
      el.chatLog = [
        { author: 'merlin', message: 'm1' },
        { author: 'testuser', message: 'u1' },
        { author: 'merlin', message: 'm2' },
        { author: 'testuser', message: 'u2' },
        { author: 'merlin', message: 'm3' },
      ]
      el.messageIndex = 5
      el.previousMessagesIndex = 5
      const up = el.shadowRoot.querySelector('#input-up-btn')
      const down = el.shadowRoot.querySelector('#input-down-btn')
      el.handleDirectionButtons({ currentTarget: up })
      // walks up past the merlin message onto the user message
      expect(el.previousMessagesIndex).to.equal(3)
      expect(el.shadowRoot.querySelector('#user-input').value).to.equal('u2')
      // walking down past the last user message clears the input
      el.handleDirectionButtons({ currentTarget: down })
      expect(el.shadowRoot.querySelector('#user-input').value).to.equal('')
      expect(el.previousMessagesIndex).to.equal(5)
    })

    it('down navigation clears cleanly at the newest message edge', async () => {
      // Regression (was a documented swarm bug): lib/chat-input.js
      // displayPreviousMessages('down') evaluated
      // this.chatLog[this.previousMessagesIndex].author BEFORE the
      // previousMessagesIndex < messageIndex bounds check. Pressing down
      // when previousMessagesIndex was messageIndex-1 incremented to
      // messageIndex and read chatLog[messageIndex], which is undefined
      // (messageIndex equals chatLog.length), throwing a TypeError that
      // broke the prompt-history navigation. The bounds check now runs
      // first, so down at the newest message clears the input cleanly.
      const el = await fixture(html`<chat-input></chat-input>`)
      el.chatLog = [
        { author: 'merlin', message: 'm1' },
        { author: 'testuser', message: 'u1' },
        { author: 'merlin', message: 'm2' },
        { author: 'testuser', message: 'u2' },
        { author: 'merlin', message: 'm3' },
      ]
      el.messageIndex = 5
      el.previousMessagesIndex = 4
      expect(() => el.displayPreviousMessages('down')).to.not.throw()
      expect(el.shadowRoot.querySelector('#user-input').value).to.equal('')
      expect(el.previousMessagesIndex).to.equal(5)
    })

    it('displayPreviousMessages walks up through user messages', async () => {
      const el = await fixture(html`<chat-input></chat-input>`)
      await aTimeout(0)
      el.chatLog = [
        { author: 'merlin', message: 'm1' },
        { author: 'testuser', message: 'u1' },
        { author: 'merlin', message: 'm2' },
        { author: 'testuser', message: 'u2' },
        { author: 'merlin', message: 'm3' },
      ]
      el.messageIndex = 5
      el.previousMessagesIndex = 5
      const textarea = el.shadowRoot.querySelector('#user-input')
      el.displayPreviousMessages('up')
      expect(textarea.value).to.equal('u2')
      el.displayPreviousMessages('up')
      expect(textarea.value).to.equal('u1')
      // already at the oldest reachable message; no further movement
      el.displayPreviousMessages('up')
      expect(textarea.value).to.equal('u1')
    })

    it('displayPreviousMessages clamps up when only merlin messages remain', async () => {
      const el = await fixture(html`<chat-input></chat-input>`)
      await aTimeout(0)
      el.chatLog = [
        { author: 'merlin', message: 'm1' },
        { author: 'merlin', message: 'm2' },
        { author: 'merlin', message: 'm3' },
      ]
      el.messageIndex = 4
      el.previousMessagesIndex = 3
      el.displayPreviousMessages('up')
      // no user messages exist; clamps back to index 1
      expect(el.previousMessagesIndex).to.equal(1)
    })

    it('displayPreviousMessages walks down and clears at the newest edge', async () => {
      const el = await fixture(html`<chat-input></chat-input>`)
      await aTimeout(0)
      el.chatLog = [
        { author: 'merlin', message: 'm1' },
        { author: 'testuser', message: 'u1' },
        { author: 'merlin', message: 'm2' },
        { author: 'testuser', message: 'u2' },
        { author: 'merlin', message: 'm3' },
      ]
      el.messageIndex = 5
      el.previousMessagesIndex = 1
      const textarea = el.shadowRoot.querySelector('#user-input')
      el.displayPreviousMessages('down')
      expect(textarea.value).to.equal('u2')
      // walking down past the last message clears the input
      el.previousMessagesIndex = 3
      el.displayPreviousMessages('down')
      expect(textarea.value).to.equal('')
      // down when already at the newest message clears as well
      el.displayPreviousMessages('down')
      expect(textarea.value).to.equal('')
    })

    it('displayPreviousMessages reports unknown directions', async () => {
      const el = await fixture(html`<chat-input></chat-input>`)
      el.displayPreviousMessages('sideways')
      expect(el.shadowRoot.querySelector('#user-input')).to.exist
    })
  })

  describe('chat-control-bar', () => {
    it('handleViewButton toggles full view in the store', async () => {
      const el = await fixture(html`<chat-control-bar></chat-control-bar>`)
      await aTimeout(0)
      el.handleViewButton()
      expect(ChatStore.isFullView).to.equal(true)
      // let the autorun re-sync el.isFullView before toggling again
      await aTimeout(0)
      el.handleViewButton()
      expect(ChatStore.isFullView).to.equal(false)
    })

    it('handleHideButton hides a visible interface only', async () => {
      const el = await fixture(html`<chat-control-bar></chat-control-bar>`)
      await aTimeout(0)
      ChatStore.isInterfaceHidden = false
      el.isInterfaceHidden = false
      el.handleHideButton()
      expect(ChatStore.isInterfaceHidden).to.equal(true)
      // already hidden: no change
      el.handleHideButton()
      expect(ChatStore.isInterfaceHidden).to.equal(true)
    })

    it('handleDevModeButton toggles developer mode', async () => {
      const el = await fixture(html`<chat-control-bar></chat-control-bar>`)
      el.handleDevModeButton()
      expect(ChatStore.developerModeEnabled).to.equal(true)
      el.handleDevModeButton()
      expect(ChatStore.developerModeEnabled).to.equal(false)
    })

    it('handleDataCollectionButton toggles collection with an alert', async () => {
      const origAlert = globalThis.alert
      let alerts = 0
      globalThis.alert = () => alerts++
      const el = await fixture(html`<chat-control-bar></chat-control-bar>`)
      el.handleDataCollectionButton()
      expect(ChatStore.dataCollectionEnabled).to.equal(false)
      expect(alerts).to.equal(1)
      el.handleDataCollectionButton()
      expect(ChatStore.dataCollectionEnabled).to.equal(true)
      expect(alerts).to.equal(2)
      globalThis.alert = origAlert
    })

    it('handleResetButton does nothing when reset is not confirmed', async () => {
      const origConfirm = globalThis.confirm
      globalThis.confirm = () => false
      const el = await fixture(html`<chat-control-bar></chat-control-bar>`)
      ChatStore.chatLog = [{ messageID: 1, author: 'merlin', message: 'x' }]
      el.handleResetButton()
      expect(ChatStore.chatLog.length).to.equal(1)
      globalThis.confirm = origConfirm
    })

    it('handleResetButton resets the chat after confirmations', async () => {
      const origConfirm = globalThis.confirm
      const origAlert = globalThis.alert
      globalThis.confirm = () => true
      globalThis.alert = () => {}
      const el = await fixture(html`<chat-control-bar></chat-control-bar>`)
      ChatStore.chatLog = [
        { messageID: 1, author: 'merlin', message: 'x' },
        { messageID: 2, author: 'testuser', message: 'y' },
      ]
      ChatStore.merlinIndex = 1
      ChatStore.messageIndex = 2
      ChatStore.userIndex = 1
      el.handleResetButton()
      // resetChat clears and startAI writes a fresh intro message
      expect(ChatStore.chatLog.length).to.equal(1)
      expect(ChatStore.chatLog[0].author).to.equal('merlin')
      expect(ChatStore.messageIndex).to.equal(1)
      expect(ChatStore.merlinIndex).to.equal(1)
      expect(ChatStore.userIndex).to.equal(0)
      globalThis.confirm = origConfirm
      globalThis.alert = origAlert
    })

    it('handleResetButton can skip the pre-reset download', async () => {
      const origConfirm = globalThis.confirm
      let confirmCount = 0
      globalThis.confirm = () => {
        confirmCount++
        return confirmCount === 1
      }
      const origCE = globalThis.document.createElement
      let anchors = 0
      globalThis.document.createElement = (tag) => {
        if (tag === 'a') {
          anchors++
          return { setAttribute: () => {}, click: () => {}, remove: () => {} }
        }
        return origCE.call(globalThis.document, tag)
      }
      const el = await fixture(html`<chat-control-bar></chat-control-bar>`)
      ChatStore.chatLog = [{ messageID: 1, author: 'merlin', message: 'x' }]
      el.handleResetButton()
      globalThis.document.createElement = origCE
      globalThis.confirm = origConfirm
      // first confirm true, second false: no download, reset still happens
      expect(anchors).to.equal(0)
      expect(confirmCount).to.equal(2)
      expect(ChatStore.chatLog.length).to.equal(1)
    })

    it('downloadChatLog delegates to the store', async () => {
      const origCE = globalThis.document.createElement
      let clicked = 0
      globalThis.document.createElement = (tag) => {
        if (tag === 'a') {
          return {
            setAttribute: () => {},
            click: () => clicked++,
            remove: () => {},
          }
        }
        return origCE.call(globalThis.document, tag)
      }
      const el = await fixture(html`<chat-control-bar></chat-control-bar>`)
      ChatStore.chatLog = [{ messageID: 1, author: 'merlin', message: 'x' }]
      el.downloadChatLog()
      globalThis.document.createElement = origCE
      expect(clicked).to.equal(1)
    })
  })

  describe('chat-developer-panel', () => {
    it('renders with engine and context selections preselected', async () => {
      const el = await fixture(html`<chat-developer-panel></chat-developer-panel>`)
      const engine = el.shadowRoot.querySelector('#engine-selection')
      const context = el.shadowRoot.querySelector('#context-selection')
      expect(engine).to.exist
      expect(context).to.exist
      expect(engine.value).to.equal('alfred')
      expect(context.value).to.equal('phys211')
    })

    it('handleSwitchEngine and handleContextChange update the store', async () => {
      const el = await fixture(html`<chat-developer-panel></chat-developer-panel>`)
      el.shadowRoot.querySelector('#engine-selection').value = 'robin'
      el.handleSwitchEngine()
      expect(ChatStore.engine).to.equal('robin')
      el.shadowRoot.querySelector('#context-selection').value = 'astro130'
      el.handleContextChange()
      expect(ChatStore.context).to.equal('astro130')
    })

    it('handleConsoleTableButton logs tables for each scope', async () => {
      const el = await fixture(html`<chat-developer-panel></chat-developer-panel>`)
      await aTimeout(0)
      el.chatLog = [
        { author: 'merlin', message: 'm1' },
        { author: 'testuser', message: 'u1' },
        { author: 'merlin', message: 'm2' },
      ]
      const tables = []
      const infos = []
      const origTable = console.table
      const origInfo = console.info
      console.table = (data) => tables.push(data)
      console.info = (msg) => infos.push(msg)
      el.handleConsoleTableButton({ currentTarget: { id: 'console-table-user' } })
      expect(tables.length).to.equal(1)
      expect(tables[0].length).to.equal(1)
      expect(tables[0][0].author).to.equal('testuser')
      el.handleConsoleTableButton({ currentTarget: { id: 'console-table-merlin' } })
      expect(tables.length).to.equal(2)
      expect(tables[1].length).to.equal(2)
      el.handleConsoleTableButton({ currentTarget: { id: 'console-table-all' } })
      expect(tables.length).to.equal(3)
      expect(tables[2].length).to.equal(3)
      expect(infos.length).to.equal(3)
      console.table = origTable
      console.info = origInfo
    })

    it('compileChatLog filters by author', async () => {
      const el = await fixture(html`<chat-developer-panel></chat-developer-panel>`)
      await aTimeout(0)
      el.chatLog = [
        { author: 'merlin', message: 'm1' },
        { author: 'testuser', message: 'u1' },
      ]
      const merlinLog = el.compileChatLog('merlin')
      expect(merlinLog.length).to.equal(1)
      expect(merlinLog[0].message).to.equal('m1')
      const userLog = el.compileChatLog('testuser')
      expect(userLog.length).to.equal(1)
      expect(userLog[0].message).to.equal('u1')
    })

    it('handleDownloadAsJsonButton delegates to the store', async () => {
      const origCE = globalThis.document.createElement
      let clicked = 0
      globalThis.document.createElement = (tag) => {
        if (tag === 'a') {
          return {
            setAttribute: () => {},
            click: () => clicked++,
            remove: () => {},
          }
        }
        return origCE.call(globalThis.document, tag)
      }
      const el = await fixture(html`<chat-developer-panel></chat-developer-panel>`)
      ChatStore.chatLog = [{ messageID: 1, author: 'merlin', message: 'x' }]
      el.handleDownloadAsJsonButton()
      globalThis.document.createElement = origCE
      expect(clicked).to.equal(1)
    })
  })

  describe('chat-message', () => {
    it('renders a sent prompt with the user character', async () => {
      const el = await fixture(
        html`<chat-message sent-prompt message="My question"></chat-message>`,
      )
      expect(el.shadowRoot.querySelector('.sent-chat-message')).to.exist
      expect(el.shadowRoot.querySelector('rpg-character')).to.exist
      expect(
        el.shadowRoot.querySelector('.message-content').textContent,
      ).to.equal('My question')
    })

    it('renders a received message with suggestions', async () => {
      ChatStore.currentSuggestions = [
        { suggestion: 'Who are you?', type: 'hax' },
        { suggestion: 'What can you do for me?', type: 'help' },
      ]
      const el = await fixture(html`<chat-message message="Hello!"></chat-message>`)
      expect(el.shadowRoot.querySelector('.received-chat-message')).to.exist
      expect(el.shadowRoot.querySelector('type-writer')).to.exist
      const suggestions = el.shadowRoot.querySelectorAll('chat-suggestion')
      expect(suggestions.length).to.equal(2)
    })

    it('pickHat selects hats for special dates and edit mode', async () => {
      const el = await fixture(html`<chat-message message="m"></chat-message>`)
      const cases = [
        [2, 12, 'party'],
        [6, 6, 'cowboy'],
        [7, 27, 'bunny'],
        [8, 15, 'watermelon'],
        [9, 19, 'pirate'],
        [10, 1, 'coffee'],
        [10, 5, 'education'],
        [12, 5, 'ninja'],
        [12, 18, 'knight'],
      ]
      cases.forEach((c) => {
        ChatStore.month = c[0]
        ChatStore.day = c[1]
        el.pickHat()
        expect(el.hat, 'hat for ' + c[0] + '/' + c[1]).to.equal(c[2])
      })
      ChatStore.month = 3
      ChatStore.day = 15
      el.pickHat()
      expect(el.hat).to.equal('none')
      el.editMode = true
      el.pickHat()
      expect(el.hat).to.equal('construction')
      el.editMode = false
    })

    it('disableSuggestions disables all and marks the chosen prompt', async () => {
      ChatStore.currentSuggestions = [
        { suggestion: 'One', type: 'hax' },
        { suggestion: 'Two', type: 'help' },
      ]
      const el = await fixture(html`<chat-message message="m"></chat-message>`)
      const suggestions = el.shadowRoot.querySelectorAll('chat-suggestion')
      el.disableSuggestions({ currentTarget: suggestions[0] })
      expect(suggestions[0].hasAttribute('disabled')).to.equal(true)
      expect(suggestions[1].hasAttribute('disabled')).to.equal(true)
      expect(suggestions[0].hasAttribute('chosen-prompt')).to.equal(true)
      expect(suggestions[1].hasAttribute('chosen-prompt')).to.equal(false)
      // an existing chosen prompt on another suggestion is kept
      el.disableSuggestions({ currentTarget: suggestions[1] })
      expect(suggestions[0].hasAttribute('chosen-prompt')).to.equal(true)
      expect(suggestions[1].hasAttribute('chosen-prompt')).to.equal(false)
    })
  })

  describe('chat-suggestion', () => {
    it('renders suggestion text with an accessible label', async () => {
      const el = await fixture(
        html`<chat-suggestion suggestion="Who are you?"></chat-suggestion>`,
      )
      expect(el.shadowRoot.querySelector('.chat-suggestion').textContent).to.equal(
        'Who are you?',
      )
      const wrapper = el.shadowRoot.querySelector('.chat-suggestion-wrapper')
      expect(wrapper.getAttribute('tabindex')).to.equal('0')
      expect(wrapper.getAttribute('aria-label')).to.contain('Who are you?')
    })

    it('sets icons per prompt type on firstUpdated', async () => {
      const cases = [
        ['suggestion', 'question-answer'],
        ['network', 'device:signal-cellular-connected-no-internet-0-bar'],
        ['help', 'help-outline'],
        ['hax', 'hax:hax2022'],
        ['bogus', 'lrn:info'],
      ]
      for (const pair of cases) {
        const el = await fixture(
          html`<chat-suggestion
            suggestion="S"
            prompt-type="${pair[0]}"
          ></chat-suggestion>`,
        )
        const icon = el.shadowRoot.querySelector('simple-icon-lite')
        expect(icon.getAttribute('icon'), 'icon for ' + pair[0]).to.equal(pair[1])
      }
    })

    it('exposes disabled state and removes tabindex when disabled', async () => {
      // regression (a11y follow-up): disabled suggestions relied on
      // tabindex removal + CSS only; aria-disabled now communicates the
      // state and the wrapper declares its button role
      const el = await fixture(
        html`<chat-suggestion suggestion="S"></chat-suggestion>`,
      )
      const wrapper = el.shadowRoot.querySelector('.chat-suggestion-wrapper')
      expect(wrapper.getAttribute('role')).to.equal('button')
      expect(wrapper.getAttribute('aria-disabled')).to.equal('false')
      el.disabled = true
      await el.updateComplete
      expect(wrapper.getAttribute('tabindex')).to.equal(null)
      expect(wrapper.getAttribute('aria-disabled')).to.equal('true')
    })

    it('activates from the keyboard on Enter and Space only', async () => {
      // regression (a11y follow-up): the deprecated @keypress binding fired
      // handleSuggestion for any printable key while focused; the @keydown
      // binding only activates on Enter / Space
      const el = await fixture(
        html`<chat-suggestion suggestion="Who are you?"></chat-suggestion>`,
      )
      const wrapper = el.shadowRoot.querySelector('.chat-suggestion-wrapper')
      const before = ChatStore.chatLog.length
      wrapper.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'a',
          bubbles: true,
          cancelable: true,
        }),
      )
      expect(ChatStore.chatLog.length).to.equal(before)
      wrapper.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      )
      expect(ChatStore.chatLog.length).to.be.greaterThan(before)
    })

    it('handleSuggestion sends the prompt when enabled', async () => {
      const el = await fixture(
        html`<chat-suggestion suggestion="Who are you?"></chat-suggestion>`,
      )
      const before = ChatStore.chatLog.length
      el.handleSuggestion()
      expect(ChatStore.chatLog.length).to.be.greaterThan(before)
      // the user message is logged and Merlin answers it
      const userMessage = ChatStore.chatLog.find(
        (m) => m.author === 'testuser',
      )
      expect(userMessage.message).to.equal('Who are you?')
      const last = ChatStore.chatLog[ChatStore.chatLog.length - 1]
      expect(last.author).to.equal('merlin')
    })

    it('handleSuggestion ignores disabled suggestions', async () => {
      const el = await fixture(
        html`<chat-suggestion suggestion="Who are you?" disabled></chat-suggestion>`,
      )
      const before = ChatStore.chatLog.length
      el.handleSuggestion()
      expect(ChatStore.chatLog.length).to.equal(before)
    })
  })

  describe('chat-interface', () => {
    it('renders the developer panel when developer mode is on', async () => {
      ChatStore.developerModeEnabled = true
      const el = await fixture(html`<chat-interface></chat-interface>`)
      await aTimeout(0)
      await el.updateComplete
      expect(el.shadowRoot.querySelector('chat-developer-panel')).to.exist
      ChatStore.developerModeEnabled = false
    })

    it('maps chat log entries to messages and passes the placeholder', async () => {
      const el = await fixture(html`<chat-interface></chat-interface>`)
      el.chatLog = [
        { message: 'hello', author: 'merlin' },
        { message: 'hi', author: 'testuser' },
      ]
      await el.updateComplete
      const messages = el.shadowRoot.querySelectorAll('chat-message')
      expect(messages.length).to.equal(2)
      expect(messages[0].hasAttribute('sent-prompt')).to.equal(false)
      expect(messages[1].hasAttribute('sent-prompt')).to.equal(true)
      expect(el.shadowRoot.querySelector('chat-input')).to.exist
    })

    it('finishedTyping scrolls to the bottom for long logs', async () => {
      const el = await fixture(html`<chat-interface></chat-interface>`)
      el.chatLog = [
        { message: 'a', author: 'merlin' },
        { message: 'b', author: 'testuser' },
      ]
      await el.updateComplete
      el.finishedTyping(new Event('type-writer-end'))
      const messages = el.shadowRoot.querySelector('.chat-messages')
      expect(messages).to.exist
    })

    it('scrollControl settles without throwing for short logs', async () => {
      const el = await fixture(html`<chat-interface></chat-interface>`)
      el.chatLog = [{ message: 'a', author: 'merlin' }]
      await el.updateComplete
      await aTimeout(0)
      expect(el.shadowRoot.querySelector('.chat-messages')).to.exist
    })

    it('updated resizes a present site builder for full view', async () => {
      const builder = document.createElement('haxcms-site-builder')
      document.body.appendChild(builder)
      const el = await fixture(html`<chat-interface></chat-interface>`)
      el.isFullView = true
      el.isInterfaceHidden = false
      await el.updateComplete
      expect(['65%', '75%'].includes(builder.style.width)).to.equal(true)
      el.isFullView = false
      el.isInterfaceHidden = true
      await el.updateComplete
      expect(builder.style.width).to.equal('100%')
      builder.remove()
    })

    it('updated records the editor ui presence', async () => {
      const editor = document.createElement('haxcms-site-editor-ui')
      document.body.appendChild(editor)
      const el = await fixture(html`<chat-interface></chat-interface>`)
      el.isFullView = true
      await el.updateComplete
      expect(el.hasEditorUI).to.equal(true)
      editor.remove()
      el.isFullView = false
      await el.updateComplete
      expect(el.hasEditorUI).to.equal(false)
    })
  })

  describe('ChatStore flows', () => {
    it('handleInteraction answers the network offline prompts', () => {
      const cases = [
        ["Why can't you connect?", 'unable to connect'],
        ['How do I fix this connection issue?', 'connected to the internet'],
        ['Why is my character wearing a hat?', 'special'],
      ]
      cases.forEach((c) => {
        ChatStore.chatLog = []
        ChatStore.handleInteraction(c[0])
        expect(ChatStore.chatLog.length).to.equal(1)
        const last = ChatStore.chatLog[ChatStore.chatLog.length - 1]
        expect(last.author).to.equal('merlin')
        expect(last.message).to.contain(c[1])
        expect(ChatStore.currentSuggestions.length).to.be.greaterThan(0)
      })
    })

    it('handleInteraction resolves AI answers on a 200 response', async () => {
      const origCall = MicroFrontendRegistry.call
      MicroFrontendRegistry.call = () =>
        Promise.resolve({
          status: 200,
          data: { answers: 'Mock answer', question: 'q1' },
        })
      ChatStore.handleInteraction('What is physics?')
      expect(ChatStore.isLoading).to.equal(true)
      await aTimeout(20)
      expect(ChatStore.isLoading).to.equal(false)
      const last = ChatStore.chatLog[ChatStore.chatLog.length - 1]
      expect(last.author).to.equal('merlin')
      expect(last.message).to.equal('Mock answer')
      expect(ChatStore.currentSuggestions.length).to.equal(0)
      MicroFrontendRegistry.call = origCall
    })

    it('non-200 responses take the error path with network suggestions', async () => {
      // Regression (was a documented swarm bug): chat-agent-store.js
      // handleInteraction only guarded the status==200 branch, so a non-200
      // response with data present still called handleMessage with
      // d.data.answers, writing the failed answer text into the log as a
      // normal merlin message with no error messaging. The status guard now
      // routes non-200 responses to the shared error path.
      const origCall = MicroFrontendRegistry.call
      MicroFrontendRegistry.call = () =>
        Promise.resolve({ status: 500, data: { answers: 'Partial answer' } })
      ChatStore.handleInteraction('Broken question?')
      await aTimeout(20)
      expect(ChatStore.isLoading).to.equal(false)
      const last = ChatStore.chatLog[ChatStore.chatLog.length - 1]
      expect(last.author).to.equal('merlin')
      expect(last.message).to.contain('having trouble connecting')
      const texts = ChatStore.currentSuggestions.map((s) => s.suggestion)
      expect(texts).to.include("Why can't you connect?")
      MicroFrontendRegistry.call = origCall
    })

    it('a 200 response with a null data payload takes the error path too', async () => {
      // companion regression for the crash case: a 200 response with data
      // null used to throw a TypeError on d.data.answers inside the .then
      const origCall = MicroFrontendRegistry.call
      MicroFrontendRegistry.call = () =>
        Promise.resolve({ status: 200, data: null })
      ChatStore.handleInteraction('Null data question?')
      await aTimeout(20)
      expect(ChatStore.isLoading).to.equal(false)
      const last = ChatStore.chatLog[ChatStore.chatLog.length - 1]
      expect(last.message).to.contain('having trouble connecting')
      MicroFrontendRegistry.call = origCall
    })

    it('initializes promptCharacterLimit to a real number', () => {
      // Regression (was a documented swarm bug): the store constructor had
      // a no-op "this.promptCharacterLimit;" statement so the value stayed
      // undefined; 0 disables the limit (no maxlength enforced)
      expect(initialPromptCharacterLimit).to.equal(0)
    })

    it('handleInteraction catches request rejections with network suggestions', async () => {
      const origCall = MicroFrontendRegistry.call
      MicroFrontendRegistry.call = () =>
        Promise.reject(new Error('boom'))
      ChatStore.handleInteraction('Failing question?')
      await aTimeout(20)
      expect(ChatStore.isLoading).to.equal(false)
      const last = ChatStore.chatLog[ChatStore.chatLog.length - 1]
      expect(last.message).to.contain('having trouble connecting')
      const texts = ChatStore.currentSuggestions.map((s) => s.suggestion)
      expect(texts).to.include("Why can't you connect?")
      MicroFrontendRegistry.call = origCall
    })

    it('handleDownload builds a data url anchor for a non-empty log', () => {
      ChatStore.chatLog = [
        { messageID: 1, author: 'merlin', message: 'hi', timestamp: 'x' },
      ]
      let clicked = 0
      const mockAnchor = {
        setAttribute: () => {},
        click: () => clicked++,
        remove: () => {},
      }
      const origCE = globalThis.document.createElement
      globalThis.document.createElement = (tag) =>
        tag === 'a' ? mockAnchor : origCE.call(globalThis.document, tag)
      ChatStore.handleDownload('txt')
      globalThis.document.createElement = origCE
      expect(clicked).to.equal(1)
    })

    it('handleDownload is a no-op for an empty log', () => {
      ChatStore.chatLog = []
      let anchors = 0
      const origCE = globalThis.document.createElement
      globalThis.document.createElement = (tag) => {
        if (tag === 'a') anchors++
        return origCE.call(globalThis.document, tag)
      }
      ChatStore.handleDownload('txt')
      globalThis.document.createElement = origCE
      expect(anchors).to.equal(0)
    })

    it('devStatement reports an unknown type through console.error', () => {
      ChatStore.developerModeEnabled = true
      let msg = null
      const origError = console.error
      console.error = (m) => (msg = m)
      ChatStore.devStatement('x', 'bogus')
      console.error = origError
      ChatStore.developerModeEnabled = false
      expect(msg).to.equal('No devStatement type specified')
    })

    it('syncs the button icon with the loading state', async () => {
      ChatStore.isLoading = true
      await aTimeout(0)
      expect(ChatStore.buttonIcon).to.equal('hax:loading')
      ChatStore.isLoading = false
      await aTimeout(0)
      expect(ChatStore.buttonIcon).to.equal('hax:wizard-hat')
      ChatStore.isLoading = null
    })

    it('startAI adds the hat suggestion on special dates', () => {
      document.querySelectorAll('chat-agent').forEach((el) => el.remove())
      ChatStore.month = 12
      ChatStore.day = 5
      ChatStore.chatLog = []
      ChatStore.startAI()
      const texts = ChatStore.currentSuggestions.map((s) => s.suggestion)
      expect(texts).to.include('Why is my character wearing a hat?')
    })

    it('startAI omits the hat suggestion on regular days', () => {
      document.querySelectorAll('chat-agent').forEach((el) => el.remove())
      ChatStore.month = 3
      ChatStore.day = 15
      ChatStore.chatLog = []
      ChatStore.startAI()
      const texts = ChatStore.currentSuggestions.map((s) => s.suggestion)
      expect(texts).to.not.include('Why is my character wearing a hat?')
    })

    it('startAI re-enables and un-chooses rendered suggestions', async () => {
      ChatStore.chatLog = [{ messageID: 1, author: 'merlin', message: 'hello' }]
      ChatStore.currentSuggestions = [{ suggestion: 'Who are you?', type: 'hax' }]
      const el = await fixture(html`<chat-agent></chat-agent>`)
      await aTimeout(0)
      await el.updateComplete
      await aTimeout(0)
      const suggestion = el.shadowRoot
        .querySelector('chat-interface')
        .shadowRoot.querySelector('chat-message')
        .shadowRoot.querySelector('chat-suggestion')
      expect(suggestion).to.exist
      suggestion.setAttribute('disabled', '')
      suggestion.setAttribute('chosen-prompt', '')
      ChatStore.startAI()
      expect(suggestion.hasAttribute('disabled')).to.equal(false)
      expect(suggestion.hasAttribute('chosen-prompt')).to.equal(false)
    })
  })
})

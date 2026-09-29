import { expect } from '@open-wc/testing'
// import ONLY the store module so its own requestAvailability definition is
// the live one (importing ../chat-agent.js would overwrite it with the widget
// version that creates a <chat-agent> element)
import { ChatStore } from '../lib/chat-agent-store.js'

// Regression coverage for the store-level singleton path
// (was a documented swarm bug): requestAvailability used to create a
// <chat-agent-store> element that is never registered as a custom element
// (a dead singleton that also raced chat-agent.js's own requestAvailability
// definition on the same global object). The store is a plain class, so the
// singleton must resolve to the ChatStore instance itself.
describe('ChatAgentStore singleton', () => {
  it('requestAvailability returns the ChatStore singleton', () => {
    const instance = globalThis.ChatAgentStore.requestAvailability()
    // boolean compare so a DOM-node regression can never hang chai on a
    // failed deep-equality message
    expect(instance === ChatStore).to.equal(true)
    expect(globalThis.ChatAgentStore.requestAvailability() === instance).to.equal(
      true,
    )
  })

  it('requestAvailability never creates an unregistered DOM element', () => {
    globalThis.ChatAgentStore.requestAvailability()
    expect(globalThis.document.querySelector('chat-agent-store')).to.be.null
  })
})

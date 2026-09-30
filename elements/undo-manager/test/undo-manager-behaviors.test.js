import { fixture, expect, html } from '@open-wc/testing'
import {
  Undo,
  UndoManager,
  UndoManagerCommand,
  UndoManagerBehaviors,
} from '../undo-manager.js'
import '../undo-manager.js'

it('exposes the undo-manager tag name', () => {
  expect(UndoManager.tag).to.equal('undo-manager')
})

const waitMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitFor(fn, timeout = 2000) {
  const start = Date.now()
  while (!fn() && Date.now() - start < timeout) {
    await waitMs(20)
  }
}

const makeCommand = () => {
  const cmd = {
    executeCount: 0,
    undoCount: 0,
    redoCount: 0,
  }
  cmd.execute = () => {
    cmd.executeCount++
  }
  cmd.undo = () => {
    cmd.undoCount++
  }
  cmd.redo = () => {
    cmd.redoCount++
  }
  return cmd
}

describe('Undo stack engine', () => {
  let stack
  let changes

  beforeEach(() => {
    stack = new Undo()
    changes = 0
    stack.changed = () => {
      changes++
    }
  })

  it('starts empty with no undo or redo available', () => {
    expect(stack.commands.length).to.equal(0)
    expect(stack.undoStackPosition).to.equal(-1)
    expect(stack.canUndo()).to.be.false
    expect(stack.canRedo()).to.be.false
    expect(stack.undoStackLimit).to.equal(20)
  })

  it('execute runs the command, pushes it and moves the position', () => {
    const cmd = makeCommand()
    stack.execute(cmd)
    expect(cmd.executeCount).to.equal(1)
    expect(stack.commands.length).to.equal(1)
    expect(stack.undoStackPosition).to.equal(0)
    expect(stack.canUndo()).to.be.true
    expect(stack.canRedo()).to.be.false
    expect(changes).to.equal(1)
  })

  it('undo runs the command undo and decrements the position', () => {
    const cmd = makeCommand()
    stack.execute(cmd)
    stack.undo()
    expect(cmd.undoCount).to.equal(1)
    expect(stack.undoStackPosition).to.equal(-1)
    expect(stack.canUndo()).to.be.false
    expect(stack.canRedo()).to.be.true
    expect(changes).to.equal(2)
  })

  it('redo runs the command redo and increments the position', () => {
    const cmd = makeCommand()
    stack.execute(cmd)
    stack.undo()
    stack.redo()
    expect(cmd.redoCount).to.equal(1)
    expect(stack.undoStackPosition).to.equal(0)
    expect(stack.canUndo()).to.be.true
    expect(stack.canRedo()).to.be.false
    expect(changes).to.equal(3)
  })

  it('default changed hook is a safe no-op when not overridden', () => {
    const plain = new Undo()
    const cmd = makeCommand()
    plain.execute(cmd)
    expect(cmd.executeCount).to.equal(1)
    plain.undo()
    expect(cmd.undoCount).to.equal(1)
    plain.redo()
    expect(cmd.redoCount).to.equal(1)
  })

  it('undo and redo are no-ops at the boundaries', () => {
    const cmd = makeCommand()
    // nothing to undo yet
    stack.undo()
    expect(cmd.undoCount).to.equal(0)
    expect(stack.undoStackPosition).to.equal(-1)
    stack.execute(cmd)
    // nothing to redo at the top of the stack
    stack.redo()
    expect(cmd.redoCount).to.equal(0)
    expect(stack.undoStackPosition).to.equal(0)
  })

  it('executing after an undo clears the redo queue', () => {
    const cmd1 = makeCommand()
    const cmd2 = makeCommand()
    stack.execute(cmd1)
    stack.undo()
    expect(stack.canRedo()).to.be.true
    stack.execute(cmd2)
    expect(stack.commands.length).to.equal(1)
    expect(stack.canRedo()).to.be.false
    // cmd1 was dropped so it can never be redone
    stack.redo()
    expect(cmd1.redoCount).to.equal(0)
    expect(cmd2.executeCount).to.equal(1)
  })

  it('trims history when the stack limit is reached', () => {
    stack.undoStackLimit = 3
    const cmds = [makeCommand(), makeCommand(), makeCommand(), makeCommand()]
    cmds.forEach((cmd) => {
      stack.execute(cmd)
    })
    expect(stack.commands.length).to.equal(3)
    expect(stack.undoStackPosition).to.equal(2)
    expect(stack.canUndo()).to.be.true
    // one of the older commands was dropped from the middle
    stack.undo()
    stack.undo()
    stack.undo()
    expect(cmds[3].undoCount).to.equal(1)
    expect(cmds[2].undoCount).to.equal(1)
    expect(cmds[0].undoCount).to.equal(1)
    expect(cmds[1].undoCount).to.equal(0)
    expect(stack.undoStackPosition).to.equal(-1)
  })
})

describe('UndoManagerCommand', () => {
  it('execute is a no-op scaffold', () => {
    const el = {}
    const cmd = new UndoManagerCommand(el, 'old', 'new')
    cmd.execute()
    expect(typeof el.innerHTML).to.equal('undefined')
  })

  it('redo sets the element value to the new value and flags ignore', () => {
    const el = { undoStack: { commands: [] }, undoStackInitialValue: '' }
    const cmd = new UndoManagerCommand(el, 'old', 'new')
    cmd.redo()
    expect(el.innerHTML).to.equal('new')
    expect(el.undoStackIgnore).to.be.true
  })

  it('undo restores the previous command value when it exists', () => {
    const prior = { newValue: 'prior-value' }
    const el = {
      undoStack: { commands: [prior], undoStackPosition: 1 },
      undoStackInitialValue: 'initial',
    }
    const cmd = new UndoManagerCommand(el, 'old', 'new')
    cmd.undo()
    expect(el.innerHTML).to.equal('prior-value')
    expect(el.undoStackIgnore).to.be.true
  })

  it('undo restores the initial value at the bottom of the stack', () => {
    const el = {
      undoStack: { commands: [], undoStackPosition: 0 },
      undoStackInitialValue: 'initial',
    }
    const cmd = new UndoManagerCommand(el, 'old', 'new')
    cmd.undo()
    expect(el.innerHTML).to.equal('initial')
    expect(el.undoStackIgnore).to.be.true
  })

  it('undo falls back to the captured old value when commands are absent', () => {
    const el = { undoStack: {}, undoStackInitialValue: 'initial' }
    const cmd = new UndoManagerCommand(el, 'old-value', 'new')
    cmd.undo()
    expect(el.innerHTML).to.equal('old-value')
    expect(el.undoStackIgnore).to.be.true
  })

  it('undo falls back to the captured old value without an undo stack', () => {
    // fixed: undo-manager.js:313 used to dereference this.el.undoStack.commands
    // without a null guard, so a null undo stack threw a TypeError before
    // the oldValue fallback could run
    const el = { undoStack: null, undoStackInitialValue: 'initial' }
    const cmd = new UndoManagerCommand(el, 'old-value', 'new')
    cmd.undo()
    expect(el.innerHTML).to.equal('old-value')
    expect(el.undoStackIgnore).to.be.true
  })
})

describe('undo-manager element behavior', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`<undo-manager></undo-manager>`)
    element.undoStackTimer = 5
  })

  it('creates an undo stack in firstUpdated with clean flags', () => {
    expect(element.undoStack).to.exist
    expect(element.commands().length).to.equal(0)
    expect(element.undoStack.undoStackPosition).to.equal(-1)
    expect(element.canUndo).to.be.false
    expect(element.canRedo).to.be.false
    expect(element.hasAttribute('can-undo')).to.be.false
    expect(element.hasAttribute('can-redo')).to.be.false
  })

  it('observes everything by default', () => {
    expect(element.undoStackObserverProps.attributes).to.be.true
    expect(element.undoStackObserverProps.attributeOldValue).to.be.true
    expect(element.undoStackObserverProps.childList).to.be.true
    expect(element.undoStackObserverProps.characterData).to.be.true
    expect(element.undoStackObserverProps.characterDataOldValue).to.be.true
    expect(element.undoStackObserverProps.subtree).to.be.true
  })

  it('debounces light dom edits into stack entries and fires events', async () => {
    const stackEvents = []
    const canUndoEvents = []
    const onStack = (e) => {
      stackEvents.push(e.detail.value)
    }
    const onCanUndo = (e) => {
      canUndoEvents.push(e.detail.value)
    }
    element.addEventListener('stack-changed', onStack)
    element.addEventListener('can-undo-changed', onCanUndo)
    element.innerHTML = '<p>one</p>'
    await waitFor(() => {
      return element.commands().length === 1
    })
    expect(element.canUndo).to.be.true
    expect(element.canRedo).to.be.false
    expect(canUndoEvents[canUndoEvents.length - 1]).to.be.true
    expect(stackEvents.length).to.be.at.least(1)
    expect(stackEvents[stackEvents.length - 1] === element.undoStack).to.be
      .true
    element.removeEventListener('stack-changed', onStack)
    element.removeEventListener('can-undo-changed', onCanUndo)
  })

  it('does not push identical or empty or initial values', async () => {
    element.innerHTML = '<p>same</p>'
    await waitFor(() => {
      return element.commands().length === 1
    })
    // identical innerHTML re-assignment still triggers mutations
    // but the value equals the previous one so nothing is pushed
    element.innerHTML = '<p>same</p>'
    await waitMs(60)
    // back to the initial (empty) value is not pushed either
    element.innerHTML = ''
    await waitMs(60)
    expect(element.commands().length).to.equal(1)
  })

  it('undo and redo restore and reapply light dom content', async () => {
    element.innerHTML = '<p>one</p>'
    await waitFor(() => {
      return element.commands().length === 1
    })
    element.innerHTML = '<p>two</p>'
    await waitFor(() => {
      return element.commands().length === 2
    })
    // undo back to one
    element.undo()
    await waitFor(() => {
      return element.innerHTML === '<p>one</p>'
    })
    await waitMs(40)
    expect(element.canUndo).to.be.true
    expect(element.canRedo).to.be.true
    // undo back to the initial empty value
    element.undo()
    await waitFor(() => {
      return element.innerHTML === ''
    })
    await waitMs(40)
    expect(element.canUndo).to.be.false
    expect(element.canRedo).to.be.true
    // redo reapplies one then two
    element.redo()
    await waitFor(() => {
      return element.innerHTML === '<p>one</p>'
    })
    await waitMs(40)
    element.redo()
    await waitFor(() => {
      return element.innerHTML === '<p>two</p>'
    })
    await waitMs(40)
    expect(element.canUndo).to.be.true
    expect(element.canRedo).to.be.false
  })

  it('fires can-redo-changed when redo availability flips', async () => {
    const canRedoEvents = []
    const onCanRedo = (e) => {
      canRedoEvents.push(e.detail.value)
    }
    element.addEventListener('can-redo-changed', onCanRedo)
    element.innerHTML = '<p>one</p>'
    await waitFor(() => {
      return element.commands().length === 1
    })
    element.undo()
    await waitFor(() => {
      return canRedoEvents.includes(true)
    })
    expect(canRedoEvents[canRedoEvents.length - 1]).to.be.true
    element.removeEventListener('can-redo-changed', onCanRedo)
  })

  it('stops tracking mutations after disconnecting', async () => {
    element.remove()
    element.innerHTML = '<p>late edit</p>'
    await waitMs(80)
    expect(element.commands().length).to.equal(0)
  })
})

describe('UndoManagerBehaviors mixin', () => {
  it('can be applied to build a new element class', () => {
    class MixedEl extends UndoManagerBehaviors(UndoManager) {}
    globalThis.customElements.define('undo-manager-mixed-test', MixedEl)
    const mixed = globalThis.document.createElement('undo-manager-mixed-test')
    expect(mixed.canUndo).to.be.false
    expect(mixed.canRedo).to.be.false
    expect(mixed.undoStackLimit).to.equal(20)
    expect(mixed.undoStackTimer).to.equal(300)
  })
})

describe('undo-manager attribute deserialization', () => {
  it('preserves can-undo and can-redo attribute values through firstUpdated', async () => {
    // fixed: undo-manager.js:164-169 — firstUpdated no longer fires an
    // initial undoStack.changed() call, so canUndo/canRedo deserialized from
    // the can-undo/can-redo attributes survive the first update
    const el = await fixture(
      html`<undo-manager can-undo can-redo></undo-manager>`,
    )
    expect(el.hasAttribute('can-undo')).to.be.true
    expect(el.hasAttribute('can-redo')).to.be.true
    expect(el.canUndo).to.be.true
    expect(el.canRedo).to.be.true
    // reflect: true keeps the attributes in sync as the values change
    el.canUndo = false
    el.canRedo = false
    await el.updateComplete
    expect(el.hasAttribute('can-undo')).to.be.false
    expect(el.hasAttribute('can-redo')).to.be.false
  })
})

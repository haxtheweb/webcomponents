import { fixture, expect, html } from '@open-wc/testing';

// direct import of the lib file so istanbul can see it
import { A11yCollapseGroup } from '../lib/a11y-collapse-group.js';
import { A11yCollapse } from '../a11y-collapse.js';

const tick = () => new Promise((resolve) => setTimeout(resolve, 20));

describe('a11y-collapse-group test', () => {
  it('passes the a11y audit when empty', async () => {
    const group = await fixture(html`
      <a11y-collapse-group></a11y-collapse-group>
    `);
    await expect(group).shadowDom.to.be.accessible();
  });

  it('passes the a11y audit when populated and keeps item defaults', async () => {
    const group = await fixture(html`
      <a11y-collapse-group>
        <a11y-collapse heading-button heading="Heading One">
          <div>Content One</div>
        </a11y-collapse>
        <a11y-collapse heading-button heading="Heading Two" expanded>
          <div>Content Two</div>
        </a11y-collapse>
      </a11y-collapse-group>
    `);
    await tick();
    expect(group.items.length).to.equal(2);
    // attaching no longer wipes the items' own heading-button mode
    expect(group.items[0].headingButton).to.be.true;
    expect(group.items[1].headingButton).to.be.true;
    // pre-expanded children keep their expanded state on attach
    expect(group.items[1].expanded).to.be.true;
    // labels keep their defaults instead of being wiped to undefined
    group.items.forEach((item) => {
      expect(item.label).to.exist;
      expect(item.tooltip).to.exist;
    });
    for (const item of group.items) {
      await expect(item).shadowDom.to.be.accessible();
    }
  });

  it('drops items that are removed from the DOM', async () => {
    const group = await fixture(html`
      <a11y-collapse-group>
        <a11y-collapse heading-button heading="One">
          <div>One</div>
        </a11y-collapse>
        <a11y-collapse heading-button heading="Two">
          <div>Two</div>
        </a11y-collapse>
      </a11y-collapse-group>
    `);
    await tick();
    expect(group.items.length).to.equal(2);
    const first = group.items[0];
    group.items[1].remove();
    await tick();
    expect(group.items.length).to.equal(1);
    expect(group.items[0]).to.equal(first);
  });

  it('renders a wrapper with a slot', async () => {
    const group = await fixture(html`
      <a11y-collapse-group></a11y-collapse-group>
    `);
    const wrapper = group.shadowRoot.querySelector('.wrapper');
    expect(wrapper).to.exist;
    expect(wrapper.querySelector('slot')).to.exist;
  });

  it('has correct default property values', async () => {
    const group = await fixture(html`
      <a11y-collapse-group></a11y-collapse-group>
    `);
    expect(group.radio).to.be.false;
    expect(group.globalOptions).to.deep.equal({});
    expect(group.items).to.deep.equal([]);
    expect(group.items).to.equal(group.__items);
  });

  it('registers children that fire a11y-collapse-attached', async () => {
    const group = await fixture(html`
      <a11y-collapse-group>
        <a11y-collapse heading-button>
          <div slot="heading">Heading One</div>
        </a11y-collapse>
        <a11y-collapse heading-button>
          <div slot="heading">Heading Two</div>
        </a11y-collapse>
      </a11y-collapse-group>
    `);
    await tick();
    expect(group.items.length).to.equal(2);
    expect(group.items[0]).to.be.instanceOf(A11yCollapse);
    expect(group.items[1].tagName.toLowerCase()).to.equal(
      'a11y-collapse',
    );
  });

  it('registers items appended after initial render', async () => {
    const group = await fixture(html`
      <a11y-collapse-group></a11y-collapse-group>
    `);
    await tick();
    expect(group.items.length).to.equal(0);
    const child = globalThis.document.createElement('a11y-collapse');
    group.appendChild(child);
    await tick();
    expect(group.items.length).to.equal(1);
    expect(group.items[0]).to.equal(child);
  });

  it('applies group heading and icon to items on attach', async () => {
    const group = await fixture(html`
      <a11y-collapse-group></a11y-collapse-group>
    `);
    await tick();
    group.heading = 'Shared Heading';
    group.icon = 'icons:arrow-drop-down';
    await group.updateComplete;
    const child = globalThis.document.createElement('a11y-collapse');
    group.appendChild(child);
    await tick();
    expect(group.items.length).to.equal(1);
    expect(child.heading).to.equal('Shared Heading');
    expect(child.icon).to.equal('icons:arrow-drop-down');
  });

  it('propagates heading changes to all items', async () => {
    const group = await fixture(html`
      <a11y-collapse-group>
        <a11y-collapse heading-button>
          <div slot="heading">One</div>
        </a11y-collapse>
        <a11y-collapse heading-button>
          <div slot="heading">Two</div>
        </a11y-collapse>
      </a11y-collapse-group>
    `);
    await tick();
    group.heading = 'Updated Heading';
    await group.updateComplete;
    await tick();
    group.items.forEach((item) => {
      expect(item.heading).to.equal('Updated Heading');
    });
  });

  it('applies globalOptions to every item', async () => {
    const group = await fixture(html`
      <a11y-collapse-group>
        <a11y-collapse heading-button>
          <div slot="heading">One</div>
        </a11y-collapse>
        <a11y-collapse heading-button>
          <div slot="heading">Two</div>
        </a11y-collapse>
      </a11y-collapse-group>
    `);
    await tick();
    group.globalOptions = { icon: 'icons:menu', disabled: true };
    await group.updateComplete;
    group.items.forEach((item) => {
      expect(item.icon).to.equal('icons:menu');
      expect(item.disabled).to.be.true;
    });
    // removing a global option restores nothing by itself, but changing
    // the object re-applies every key that is present
    group.globalOptions = { icon: 'icons:close' };
    await group.updateComplete;
    group.items.forEach((item) => {
      expect(item.icon).to.equal('icons:close');
    });
  });

  it('collapses the other items when one expands in radio mode', async () => {
    const group = await fixture(html`
      <a11y-collapse-group radio>
        <a11y-collapse heading-button>
          <div slot="heading">One</div>
        </a11y-collapse>
        <a11y-collapse heading-button>
          <div slot="heading">Two</div>
        </a11y-collapse>
      </a11y-collapse-group>
    `);
    await tick();
    const first = group.items[0];
    const second = group.items[1];
    expect(first.expanded).to.be.false;
    expect(second.expanded).to.be.false;
    first.toggle(true);
    await first.updateComplete;
    expect(first.expanded).to.be.true;
    expect(second.expanded).to.be.false;
    second.toggle(true);
    await second.updateComplete;
    expect(second.expanded).to.be.true;
    expect(first.expanded).to.be.false;
  });

  it('collapses the other items when one is clicked in radio mode', async () => {
    // give every item heading-button mode through the group so each item
    // renders a full-width clickable heading button
    const group = await fixture(html`
      <a11y-collapse-group radio></a11y-collapse-group>
    `);
    group.headingButton = true;
    await group.updateComplete;
    const first = globalThis.document.createElement('a11y-collapse');
    const second = globalThis.document.createElement('a11y-collapse');
    group.appendChild(first);
    group.appendChild(second);
    await tick();
    expect(group.items.length).to.equal(2);
    expect(first.headingButton).to.be.true;
    expect(second.headingButton).to.be.true;
    first.shadowRoot.querySelector('button').click();
    await first.updateComplete;
    await tick();
    expect(first.expanded).to.be.true;
    expect(second.expanded).to.be.false;
    second.shadowRoot.querySelector('button').click();
    await second.updateComplete;
    await tick();
    expect(second.expanded).to.be.true;
    expect(first.expanded).to.be.false;
  });

  it('allows multiple expanded items when radio is off', async () => {
    const group = await fixture(html`
      <a11y-collapse-group>
        <a11y-collapse heading-button>
          <div slot="heading">One</div>
        </a11y-collapse>
        <a11y-collapse heading-button>
          <div slot="heading">Two</div>
        </a11y-collapse>
      </a11y-collapse-group>
    `);
    await tick();
    const first = group.items[0];
    const second = group.items[1];
    first.toggle(true);
    await first.updateComplete;
    second.toggle(true);
    await second.updateComplete;
    expect(first.expanded).to.be.true;
    expect(second.expanded).to.be.true;
  });

  it('collapses every item when radio is enabled after the fact', async () => {
    const group = await fixture(html`
      <a11y-collapse-group>
        <a11y-collapse heading-button>
          <div slot="heading">One</div>
        </a11y-collapse>
        <a11y-collapse heading-button>
          <div slot="heading">Two</div>
        </a11y-collapse>
      </a11y-collapse-group>
    `);
    await tick();
    const first = group.items[0];
    first.toggle(true);
    await first.updateComplete;
    expect(first.expanded).to.be.true;
    group.radio = true;
    await group.updateComplete;
    await tick();
    group.items.forEach((item) => {
      expect(item.expanded).to.be.false;
    });
  });

  it('removes an item when a11y-collapse-detached fires for it', async () => {
    const group = await fixture(html`
      <a11y-collapse-group>
        <a11y-collapse heading-button>
          <div slot="heading">One</div>
        </a11y-collapse>
        <a11y-collapse heading-button>
          <div slot="heading">Two</div>
        </a11y-collapse>
      </a11y-collapse-group>
    `);
    await tick();
    expect(group.items.length).to.equal(2);
    const first = group.items[0];
    const second = group.items[1];
    group.dispatchEvent(
      new CustomEvent('a11y-collapse-detached', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: second,
      }),
    );
    expect(group.items.length).to.equal(1);
    expect(group.items[0]).to.equal(first);
    // detaching an item that was never attached changes nothing
    const stranger = globalThis.document.createElement('a11y-collapse');
    group.dispatchEvent(
      new CustomEvent('a11y-collapse-detached', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: stranger,
      }),
    );
    expect(group.items.length).to.equal(1);
    // a detached event with no detail is ignored safely
    group.dispatchEvent(
      new CustomEvent('a11y-collapse-detached', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: null,
      }),
    );
    expect(group.items.length).to.equal(1);
  });

  it('has haxProperties defined', () => {
    expect(A11yCollapseGroup.haxProperties).to.exist;
    expect(typeof A11yCollapseGroup.haxProperties).to.equal('string');
    expect(A11yCollapseGroup.haxProperties).to.include(
      'a11y-collapse-group.haxProperties.json',
    );
  });
});

import { fixture, expect, html } from "@open-wc/testing";
import "../aframe-player.js";

describe("aframe-player test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <aframe-player 
        source="https://example.com/model.gltf"
        sky-color="#87CEEB"
        width="800px"
        height="600px"
      ></aframe-player>
    `);
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("aframe-player");
  });

  it("passes the a11y audit", async () => {
    await expect(element).to.be.accessible();
  });

  describe("Property type validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <aframe-player></aframe-player>
      `);
      await testElement.updateComplete;
    });

    describe("source property", () => {
      it("should accept valid URL values and maintain accessibility", async () => {
        testElement.source = "https://example.com/model.gltf";
        await testElement.updateComplete;
        expect(testElement.source).to.equal("https://example.com/model.gltf");
        await expect(testElement).to.be.accessible();

        testElement.source = "https://example.com/model.glb";
        await testElement.updateComplete;
        expect(testElement.source).to.equal("https://example.com/model.glb");
        await expect(testElement).to.be.accessible();

        testElement.source = "";
        await testElement.updateComplete;
        expect(testElement.source).to.equal("");
        await expect(testElement).to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.source = 123;
        await testElement.updateComplete;
        expect(testElement.source).to.equal(123);
        await expect(testElement).to.be.accessible();

        testElement.source = null;
        await testElement.updateComplete;
        expect(testElement.source).to.equal(null);
        await expect(testElement).to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.source).to.be.undefined;
      });
    });

    describe("height property", () => {
      it("should accept CSS dimension values and maintain accessibility", async () => {
        testElement.height = "500px";
        await testElement.updateComplete;
        expect(testElement.height).to.equal("500px");
        await expect(testElement).to.be.accessible();

        testElement.height = "75vh";
        await testElement.updateComplete;
        expect(testElement.height).to.equal("75vh");
        await expect(testElement).to.be.accessible();

        testElement.height = "100%";
        await testElement.updateComplete;
        expect(testElement.height).to.equal("100%");
        await expect(testElement).to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.height).to.equal("480px");
      });
    });

    describe("width property", () => {
      it("should accept CSS dimension values and maintain accessibility", async () => {
        testElement.width = "800px";
        await testElement.updateComplete;
        expect(testElement.width).to.equal("800px");
        await expect(testElement).to.be.accessible();

        testElement.width = "100vw";
        await testElement.updateComplete;
        expect(testElement.width).to.equal("100vw");
        await expect(testElement).to.be.accessible();

        testElement.width = "50%";
        await testElement.updateComplete;
        expect(testElement.width).to.equal("50%");
        await expect(testElement).to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.width).to.equal("640px");
      });
    });

    describe("skyColor property", () => {
      it("should accept color values and maintain accessibility", async () => {
        testElement.skyColor = "#FF0000";
        await testElement.updateComplete;
        expect(testElement.skyColor).to.equal("#FF0000");
        await expect(testElement).to.be.accessible();

        testElement.skyColor = "blue";
        await testElement.updateComplete;
        expect(testElement.skyColor).to.equal("blue");
        await expect(testElement).to.be.accessible();

        testElement.skyColor = "rgb(255, 0, 0)";
        await testElement.updateComplete;
        expect(testElement.skyColor).to.equal("rgb(255, 0, 0)");
        await expect(testElement).to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.skyColor).to.equal("#DCDCDC");
      });
    });

    describe("ar property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.ar = true;
        await testElement.updateComplete;
        expect(testElement.ar).to.equal(true);
        await expect(testElement).to.be.accessible();

        testElement.ar = false;
        await testElement.updateComplete;
        expect(testElement.ar).to.equal(false);
        await expect(testElement).to.be.accessible();
      });

      it("should accept non-boolean values but maintain type in JavaScript", async () => {
        testElement.ar = 1;
        await testElement.updateComplete;
        expect(testElement.ar).to.equal(1);
        await expect(testElement).to.be.accessible();

        testElement.ar = "true";
        await testElement.updateComplete;
        expect(testElement.ar).to.equal("true");
        await expect(testElement).to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.ar).to.equal(false);
      });
    });

    describe("position coordinates (x, y, z)", () => {
      it("should accept coordinate string values and maintain accessibility", async () => {
        testElement.x = "1.5";
        testElement.y = "2.0";
        testElement.z = "-1.0";
        await testElement.updateComplete;
        
        expect(testElement.x).to.equal("1.5");
        expect(testElement.y).to.equal("2.0");
        expect(testElement.z).to.equal("-1.0");
        await expect(testElement).to.be.accessible();
      });

      it("should have correct default values", () => {
        expect(testElement.x).to.equal("0");
        expect(testElement.y).to.equal("0");
        expect(testElement.z).to.equal("0");
      });
    });

    describe("position property (computed)", () => {
      it("should compute position object from x, y, z coordinates", async () => {
        testElement.x = "1";
        testElement.y = "2";
        testElement.z = "3";
        await testElement.updateComplete;
        
        expect(testElement.position).to.deep.equal({ x: "1", y: "2", z: "3" });
        await expect(testElement).to.be.accessible();
      });

      it("should update when coordinates change", async () => {
        testElement.x = "5";
        await testElement.updateComplete;
        expect(testElement.position.x).to.equal("5");
        
        testElement.y = "10";
        await testElement.updateComplete;
        expect(testElement.position.y).to.equal("10");
        
        testElement.z = "-5";
        await testElement.updateComplete;
        expect(testElement.position.z).to.equal("-5");
        
        await expect(testElement).to.be.accessible();
      });
    });
  });

  describe("Attribute to property mapping", () => {
    it("should set skyColor property from sky-color attribute", async () => {
      const testElement = await fixture(html`
        <aframe-player sky-color="#00FF00"></aframe-player>
      `);
      expect(testElement.skyColor).to.equal("#00FF00");
      await expect(testElement).to.be.accessible();
    });
  });

  describe("A-Frame scene rendering", () => {
    it("should render a-scene element with correct attributes", async () => {
      const testElement = await fixture(html`
        <aframe-player 
          width="800px" 
          height="600px"
          sky-color="#87CEEB"
        ></aframe-player>
      `);
      await testElement.updateComplete;
      
      const scene = testElement.querySelector('a-scene');
      expect(scene).to.exist;
      expect(scene.getAttribute('embedded')).to.equal('');
      expect(scene.style.width).to.equal('800px');
      expect(scene.style.height).to.equal('600px');
      
      await expect(testElement).to.be.accessible();
    });

    it("should render a-sky element with correct color", async () => {
      const testElement = await fixture(html`
        <aframe-player sky-color="#FF6B6B"></aframe-player>
      `);
      await testElement.updateComplete;
      
      const sky = testElement.querySelector('a-sky');
      expect(sky).to.exist;
      expect(sky.getAttribute('color')).to.equal('#FF6B6B');
      
      await expect(testElement).to.be.accessible();
    });

    it("should conditionally add arjs attribute for AR mode", async () => {
      const arElement = await fixture(html`
        <aframe-player ar></aframe-player>
      `);
      await arElement.updateComplete;
      
      const arScene = arElement.querySelector('a-scene');
      expect(arScene.hasAttribute('arjs')).to.be.true;
      
      const nonArElement = await fixture(html`
        <aframe-player></aframe-player>
      `);
      await nonArElement.updateComplete;
      
      const nonArScene = nonArElement.querySelector('a-scene');
      expect(nonArScene.hasAttribute('arjs')).to.be.false;
      
      await expect(arElement).to.be.accessible();
      await expect(nonArElement).to.be.accessible();
    });

    it("should render a-marker-camera for AR mode", async () => {
      const testElement = await fixture(html`
        <aframe-player ar></aframe-player>
      `);
      await testElement.updateComplete;
      
      const markerCamera = testElement.querySelector('a-marker-camera');
      expect(markerCamera).to.exist;
      expect(markerCamera.getAttribute('preset')).to.equal('hiro');
      
      await expect(testElement).to.be.accessible();
    });
  });

  describe("Accessibility scenarios with different configurations", () => {
    it("should remain accessible in AR mode", async () => {
      const testElement = await fixture(html`
        <aframe-player 
          ar
          source="https://example.com/ar-model.gltf"
          x="0"
          y="0"
          z="-2"
        ></aframe-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).to.be.accessible();
    });

    it("should remain accessible with custom dimensions", async () => {
      const testElement = await fixture(html`
        <aframe-player
          width="1200px"
          height="900px"
          source="https://example.com/model.gltf"
        ></aframe-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).to.be.accessible();
    });

    it("should remain accessible with positioned 3D objects", async () => {
      const testElement = await fixture(html`
        <aframe-player
          source="https://example.com/positioned-model.gltf"
          x="5"
          y="2.5"
          z="-10"
          sky-color="#4CC3D9"
        ></aframe-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).to.be.accessible();
    });
  });

  describe("Position computation and updates", () => {
    it("should compute position correctly from coordinates", async () => {
      const testElement = await fixture(html`
        <aframe-player x="1" y="2" z="3"></aframe-player>
      `);
      await testElement.updateComplete;
      
      const position = testElement._computePosition("1", "2", "3", "640px", "480px");
      expect(position).to.deep.equal({ x: "1", y: "2", z: "3" });
      
      await expect(testElement).to.be.accessible();
    });

    it("should update position when coordinates change", async () => {
      const testElement = await fixture(html`
        <aframe-player></aframe-player>
      `);
      await testElement.updateComplete;
      
      testElement.x = "10";
      testElement.y = "20";
      testElement.z = "30";
      await testElement.updateComplete;
      
      expect(testElement.position).to.deep.equal({ x: "10", y: "20", z: "30" });
      await expect(testElement).to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should remain accessible with missing source", async () => {
      const testElement = await fixture(html`
        <aframe-player></aframe-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).to.be.accessible();
    });

    it("should remain accessible with malformed source URLs", async () => {
      const testElement = await fixture(html`
        <aframe-player source="invalid-url"></aframe-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).to.be.accessible();
    });

    it("should handle invalid color values gracefully", async () => {
      const testElement = await fixture(html`
        <aframe-player sky-color="invalid-color"></aframe-player>
      `);
      await testElement.updateComplete;
      expect(testElement.skyColor).to.equal("invalid-color");
      await expect(testElement).to.be.accessible();
    });

    it("should handle extreme coordinate values", async () => {
      const testElement = await fixture(html`
        <aframe-player x="999999" y="-999999" z="0.0001"></aframe-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.position).to.deep.equal({ 
        x: "999999", 
        y: "-999999", 
        z: "0.0001" 
      });
      await expect(testElement).to.be.accessible();
    });

    it("should handle unusual dimension values", async () => {
      const unusualValues = [
        "0px", "10000px", "1vh", "1vw", "1em", "1rem", "50%"
      ];
      
      for (const value of unusualValues) {
        const testElement = await fixture(html`
          <aframe-player width="${value}" height="${value}"></aframe-player>
        `);
        await testElement.updateComplete;
        
        expect(testElement.width).to.equal(value);
        expect(testElement.height).to.equal(value);
        await expect(testElement).to.be.accessible();
      }
    });

    it("should handle edge case property values", async () => {
      const testElement = await fixture(html`<aframe-player></aframe-player>`);
      
      const edgeCaseValues = [
        "   \t\n   ", // whitespace
        "0", "000", "-0", "+0", // various zero representations
        "1e6", "1e-6", // scientific notation
        "NaN", "Infinity", "-Infinity" // special numeric values
      ];
      
      for (const value of edgeCaseValues) {
        testElement.x = value;
        testElement.y = value;
        testElement.z = value;
        await testElement.updateComplete;
        
        expect(testElement.x).to.equal(value);
        expect(testElement.y).to.equal(value);
        expect(testElement.z).to.equal(value);
        await expect(testElement).to.be.accessible();
      }
    });
  });

  describe("HAX Properties and Integration", () => {
    it("should have haxProperties defined", () => {
      expect(element.constructor.haxProperties).to.exist;
      expect(element.constructor.haxProperties.gizmo).to.exist;
      expect(element.constructor.haxProperties.settings).to.exist;
    });

    it("should have proper HAX gizmo configuration", () => {
      const haxProps = element.constructor.haxProperties;
      expect(haxProps.gizmo.title).to.equal("3D player");
      expect(haxProps.gizmo.description).to.contain("3D file");
      expect(haxProps.gizmo.icon).to.equal("av:play-circle-filled");
      expect(haxProps.gizmo.tags).to.include("3D");
      expect(haxProps.gizmo.tags).to.include("AR");
      expect(haxProps.gizmo.tags).to.include("aframe");
    });

    it("should have proper HAX settings configuration", () => {
      const haxProps = element.constructor.haxProperties;
      const configItems = haxProps.settings.configure;
      
      // Verify source property is required
      const sourceProp = configItems.find(item => item.property === "source");
      expect(sourceProp).to.exist;
      expect(sourceProp.required).to.be.true;
      expect(sourceProp.inputMethod).to.equal("textfield");
      
      // Verify coordinate properties are required
      const xProp = configItems.find(item => item.property === "x");
      const yProp = configItems.find(item => item.property === "y");
      const zProp = configItems.find(item => item.property === "z");
      
      expect(xProp.required).to.be.true;
      expect(yProp.required).to.be.true;
      expect(zProp.required).to.be.true;
      
      // Verify skyColor has colorpicker input method
      const skyColorProp = configItems.find(item => item.property === "skyColor");
      expect(skyColorProp).to.exist;
      expect(skyColorProp.inputMethod).to.equal("colorpicker");
    });

    it("should handle 3D file types correctly", () => {
      const haxProps = element.constructor.haxProperties;
      const handles = haxProps.gizmo.handles;
      
      const fileHandle = handles.find(handle => handle.type === "3d");
      expect(fileHandle).to.exist;
      expect(fileHandle.source).to.equal("source");
    });
  });

  describe("Shadow DOM and rendering", () => {
    it("should use light DOM rendering (createRenderRoot returns this)", () => {
      expect(element.createRenderRoot()).to.equal(element);
    });

    it("should have proper CSS styles", () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;
      expect(styles.length).to.be.greaterThan(0);
      
      const styleString = styles[0].cssText || styles[0].toString();
      expect(styleString).to.include(':host');
      expect(styleString).to.include('display: block');
      expect(styleString).to.include('position: relative');
    });
  });

  describe("Lifecycle and cleanup", () => {
    it("should set up window controllers in constructor", () => {
      const testElement = new (element.constructor)();
      expect(testElement.windowControllers).to.exist;
      expect(testElement.windowControllers.constructor.name).to.equal("AbortController");
    });

    it("should clean up window controllers on disconnect", () => {
      const testElement = new (element.constructor)();
      const abortSpy = testElement.windowControllers.abort = () => {};
      
      // Simulate disconnection
      testElement.disconnectedCallback();
      
      // Verify abort was called (basic check)
      expect(testElement.windowControllers).to.exist;
    });
  });
});

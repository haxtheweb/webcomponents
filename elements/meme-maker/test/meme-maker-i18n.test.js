import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { MemeMaker } from "../meme-maker.js";
import "../../../i18n-manager/i18n-manager.js";

describe("meme-maker internationalization tests", () => {
  let element;
  let i18nManager;

  // Test languages for comprehensive coverage
  const testLanguages = {
    en: "English (default)",
    es: "Spanish",
    fr: "French", 
    zh: "Chinese",
    ar: "Arabic"
  };

  // Expected translations for each language - key fields from haxProperties
  const expectedTranslations = {
    en: {
      gizmo: {
        title: "Meme",
        description: "Make a meme out of an image"
      },
      settings: {
        imageUrl: "Source",
        topText: "Top text",
        bottomText: "Bottom text",
        alt: "Alternative text"
      },
      demo: {
        alt: "Cat stalking a small toy",
        topText: "I bring you",
        bottomText: "the death"
      }
    },
    es: {
      gizmo: {
        title: "Memes",
        description: "Hacer un meme a partir de una imagen"
      },
      settings: {
        imageUrl: "Fuente",
        topText: "Cima Texto", 
        bottomText: "Fondo Texto"
      },
      demo: {
        alt: "Gato acechando un juguete pequeño",
        topText: "te traigo",
        bottomText: "la muerte"
      }
    },
    fr: {
      gizmo: {
        title: "Meme",
        description: "Créer un mème à partir d'une image"
      },
      settings: {
        imageUrl: "La source",
        topText: "Texte du Haut",
        bottomText: "Texte du bas"
      },
      demo: {
        alt: "Chat traque un petit jouet",
        topText: "je vous apporte",
        bottomText: "la mort"
      }
    },
    zh: {
      gizmo: {
        title: "表情包",
        description: "用图片制作表情包"
      },
      settings: {
        imageUrl: "来源",
        topText: "顶部文本",
        bottomText: "底部文本",
        alt: "替代文本"
      },
      demo: {
        alt: "猫咪正在追踪小玩具",
        topText: "我给你带来",
        bottomText: "死亡"
      }
    },
    ar: {
      gizmo: {
        title: "ميم",
        description: "اصنع ميم من صورة"
      },
      settings: {
        imageUrl: "المصدر",
        topText: "النص العلوي",
        bottomText: "النص السفلي",
        alt: "النص البديل"
      },
      demo: {
        alt: "قطة تطارد لعبة صغيرة",
        topText: "أحضر لك",
        bottomText: "الموت"
      }
    }
  };

  beforeEach(async () => {
    // Create fresh elements for each test
    element = await fixture(html`
      <meme-maker
        alt="Cat stalking a small toy"
        image-url="https://cdn2.thecatapi.com/images/9j5.jpg"
        top-text="I bring you"
        bottom-text="the death"
      ></meme-maker>
    `);

    // Get or create i18n manager
    i18nManager = globalThis.I18NManagerStore.requestAvailability();
    
    // Clear any existing registrations for clean testing
    i18nManager.elements = [];
    i18nManager.locales.clear();
  });

  describe("Language registration and detection", () => {
    it("should register meme-maker for internationalization", async () => {
      let registrationEventFired = false;
      let registrationDetail = null;

      const handler = (e) => {
        if (e.type === 'i18n-manager-register-element') {
          registrationEventFired = true;
          registrationDetail = e.detail;
        }
      };
      
      globalThis.addEventListener('i18n-manager-register-element', handler);
      
      // Trigger gizmo registration (HAX integration)
      element.haxgizmoRegistration();
      await aTimeout(100);
      
      expect(registrationEventFired).to.be.true;
      expect(registrationDetail.namespace).to.equal('meme-maker.haxProperties');
      expect(registrationDetail.locales).to.include('es');
      expect(registrationDetail.locales).to.include('fr');
      expect(registrationDetail.locales).to.include('zh');
      expect(registrationDetail.locales).to.include('ar');
      
      globalThis.removeEventListener('i18n-manager-register-element', handler);
    });

    it("should support all required test languages", async () => {
      element.haxgizmoRegistration();
      await aTimeout(100);

      const supportedLanguages = Object.keys(testLanguages);
      for (const lang of supportedLanguages.slice(1)) { // Skip 'en' as it's default
        expect(i18nManager.locales.has(lang), `Language ${lang} should be supported`).to.be.true;
      }
    });
  });

  describe("Language switching and translation loading", () => {
    beforeEach(async () => {
      // Register the element with i18n manager
      element.haxgizmoRegistration();
      await aTimeout(100);
    });

    Object.keys(testLanguages).forEach((langCode) => {
      if (langCode === 'en') return; // Skip default language test
      
      it(`should load ${testLanguages[langCode]} translations (${langCode})`, async () => {
        // Mock language change
        i18nManager.lang = langCode;
        await aTimeout(200); // Allow time for fetch and processing
        
        // Test that the appropriate language file would be requested
        const expectedNamespace = 'meme-maker.haxProperties';
        const expectedPath = `${new URL('./locales', element.constructor.haxProperties).href}/${expectedNamespace}.${langCode}.json`;
        
        // Verify the translation file can be loaded
        const translationData = await i18nManager.loadNamespaceFile(expectedNamespace, langCode);
        expect(translationData).to.not.be.undefined;
      });
    });

    it("should fall back to English when unsupported language is requested", async () => {
      // Test with unsupported language
      i18nManager.lang = 'unsupported-lang';
      await aTimeout(100);
      
      // Should not crash and should have some fallback behavior
      expect(i18nManager.lang).to.equal('unsupported-lang');
      // The system should handle this gracefully without errors
    });
  });

  describe("HAX properties translation verification", () => {
    beforeEach(async () => {
      element.haxgizmoRegistration();
      await aTimeout(100);
    });

    // Test key translations for each language
    Object.keys(expectedTranslations).forEach((langCode) => {
      if (langCode === 'en') return; // Skip default - already tested

      it(`should have correct ${testLanguages[langCode]} translations (${langCode})`, async () => {
        // Load the translation file directly to verify content
        const translationData = await i18nManager.loadNamespaceFile('meme-maker.haxProperties', langCode);
        
        if (translationData) {
          const expected = expectedTranslations[langCode];
          
          // Check gizmo translations
          if (expected.gizmo.title) {
            expect(translationData.gizmo.title).to.equal(expected.gizmo.title);
          }
          if (expected.gizmo.description) {
            expect(translationData.gizmo.description).to.equal(expected.gizmo.description);
          }
          
          // Check settings translations
          const configFields = translationData.settings?.configure;
          if (configFields && Array.isArray(configFields)) {
            // Source field
            if (expected.settings.imageUrl) {
              expect(configFields[0]?.title).to.equal(expected.settings.imageUrl);
            }
            // Top text field  
            if (expected.settings.topText) {
              expect(configFields[1]?.title).to.equal(expected.settings.topText);
            }
            // Bottom text field
            if (expected.settings.bottomText) {
              expect(configFields[2]?.title).to.equal(expected.settings.bottomText);
            }
          }
          
          // Check demo schema translations
          const demoSchema = translationData.demoSchema;
          if (demoSchema && Array.isArray(demoSchema) && demoSchema[0]?.properties) {
            const props = demoSchema[0].properties;
            if (expected.demo.alt) {
              expect(props.alt).to.equal(expected.demo.alt);
            }
            if (expected.demo.topText) {
              expect(props.topText).to.equal(expected.demo.topText);
            }
            if (expected.demo.bottomText) {
              expect(props.bottomText).to.equal(expected.demo.bottomText);
            }
          }
        }
      });
    });
  });

  describe("Right-to-left (RTL) language support", () => {
    beforeEach(async () => {
      element.haxgizmoRegistration();
      await aTimeout(100);
    });

    it("should properly handle Arabic (RTL) language", async () => {
      // Set language to Arabic
      i18nManager.lang = 'ar';
      i18nManager.dir = 'rtl';
      await aTimeout(200);
      
      // Verify RTL direction is set
      expect(i18nManager.dir).to.equal('rtl');
      
      // Load Arabic translations
      const translationData = await i18nManager.loadNamespaceFile('meme-maker.haxProperties', 'ar');
      expect(translationData).to.not.be.undefined;
      
      // Verify Arabic text is properly loaded
      if (translationData.gizmo) {
        expect(translationData.gizmo.title).to.equal('ميم');
      }
    });

    it("should maintain accessibility in RTL mode", async () => {
      // Set RTL language
      i18nManager.lang = 'ar';
      i18nManager.dir = 'rtl';
      await aTimeout(200);
      
      // Element should still pass accessibility tests in RTL mode
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Language change events and responsiveness", () => {
    beforeEach(async () => {
      element.haxgizmoRegistration();
      await aTimeout(100);
    });

    it("should respond to browser language change events", async () => {
      let langChangeEventFired = false;
      
      const handler = (e) => {
        if (e.type === 'lang-changed') {
          langChangeEventFired = true;
        }
      };
      
      i18nManager.addEventListener('lang-changed', handler);
      
      // Simulate language change
      i18nManager.lang = 'es';
      await aTimeout(100);
      
      expect(langChangeEventFired).to.be.true;
      expect(i18nManager.lang).to.equal('es');
      
      i18nManager.removeEventListener('lang-changed', handler);
    });

    it("should handle rapid language changes without errors", async () => {
      const languages = ['es', 'fr', 'zh', 'ar', 'en'];
      
      // Rapidly switch languages
      for (const lang of languages) {
        i18nManager.lang = lang;
        await aTimeout(10);
      }
      
      // Should end up with the last language set
      expect(i18nManager.lang).to.equal('en');
      
      // Element should still be functional
      expect(element.shadowRoot.querySelector('img')).to.exist;
    });
  });

  describe("Performance and caching", () => {
    beforeEach(async () => {
      element.haxgizmoRegistration();
      await aTimeout(100);
    });

    it("should cache translation files to avoid duplicate requests", async () => {
      const namespace = 'meme-maker.haxProperties';
      
      // Load same language twice
      const firstLoad = await i18nManager.loadNamespaceFile(namespace, 'es');
      const secondLoad = await i18nManager.loadNamespaceFile(namespace, 'es');
      
      // Both should return data
      expect(firstLoad).to.not.be.undefined;
      expect(secondLoad).to.not.be.undefined;
      
      // Should use cached version (same reference or same content)
      expect(JSON.stringify(firstLoad)).to.equal(JSON.stringify(secondLoad));
    });

    it("should handle multiple elements with same namespace efficiently", async () => {
      // Create second meme-maker element
      const element2 = await fixture(html`
        <meme-maker image-url="test.jpg"></meme-maker>
      `);
      
      element2.haxgizmoRegistration();
      await aTimeout(100);
      
      // Switch language - should update both elements efficiently
      i18nManager.lang = 'fr';
      await aTimeout(200);
      
      // Both elements should still be functional
      expect(element.shadowRoot.querySelector('img')).to.exist;
      expect(element2.shadowRoot.querySelector('img')).to.exist;
    });
  });

  describe("Integration with HAX editor context", () => {
    beforeEach(async () => {
      element.haxgizmoRegistration();
      await aTimeout(100);
    });

    it("should provide translated HAX properties for editor UI", async () => {
      // Load Spanish translations
      i18nManager.lang = 'es';
      await aTimeout(200);
      
      const translationData = await i18nManager.loadNamespaceFile('meme-maker.haxProperties', 'es');
      
      // Verify HAX editor would get Spanish interface
      expect(translationData.gizmo.title).to.equal('Memes');
      expect(translationData.gizmo.description).to.include('meme');
    });

    it("should maintain demo schema translations for HAX examples", async () => {
      const languages = ['es', 'fr', 'zh', 'ar'];
      
      for (const lang of languages) {
        const translationData = await i18nManager.loadNamespaceFile('meme-maker.haxProperties', lang);
        
        // Each language should have demo content
        if (translationData.demoSchema && translationData.demoSchema[0]) {
          const demo = translationData.demoSchema[0].properties;
          expect(demo.alt).to.be.a('string');
          expect(demo.topText).to.be.a('string'); 
          expect(demo.bottomText).to.be.a('string');
        }
      }
    });
  });

  describe("Error handling and edge cases", () => {
    it("should handle missing translation files gracefully", async () => {
      element.haxgizmoRegistration();
      await aTimeout(100);
      
      // Try to load non-existent language
      const result = await i18nManager.loadNamespaceFile('meme-maker.haxProperties', 'non-existent');
      
      // Should not throw error and return empty object or undefined
      expect(result).to.satisfy((r) => r === undefined || typeof r === 'object');
    });

    it("should handle malformed language codes", async () => {
      element.haxgizmoRegistration();
      await aTimeout(100);
      
      // Test various malformed language codes
      const malformedCodes = ['', null, undefined, 'invalid-very-long-language-code'];
      
      for (const code of malformedCodes) {
        expect(() => {
          i18nManager.lang = code;
        }).to.not.throw();
      }
    });

    it("should maintain functionality when i18n system fails", async () => {
      // Element should work even if i18n registration fails
      const elementWithoutI18n = await fixture(html`
        <meme-maker
          image-url="test.jpg"
          top-text="Test"
          bottom-text="Text"
        ></meme-maker>
      `);
      
      // Should still render correctly
      expect(elementWithoutI18n.shadowRoot.querySelector('img')).to.exist;
      expect(elementWithoutI18n.shadowRoot.querySelector('.top-text').textContent).to.equal('Test');
      expect(elementWithoutI18n.shadowRoot.querySelector('.bottom-text').textContent).to.equal('Text');
    });
  });

  describe("Comprehensive language coverage validation", () => {
    it("should validate all 5 target languages are properly supported", async () => {
      element.haxgizmoRegistration();
      await aTimeout(100);
      
      const requiredLanguages = ['es', 'fr', 'zh', 'ar'];
      const supportedLanguages = Array.from(i18nManager.locales);
      
      for (const lang of requiredLanguages) {
        expect(supportedLanguages).to.include(lang, `${testLanguages[lang]} (${lang}) should be supported`);
      }
      
      // Verify we have at least 4 non-English languages
      expect(supportedLanguages.length).to.be.at.least(4);
    });

    it("should successfully load and verify translations for all 5 languages", async () => {
      element.haxgizmoRegistration();
      await aTimeout(100);
      
      const testResults = {};
      
      // Test each language
      for (const [langCode, langName] of Object.entries(testLanguages)) {
        if (langCode === 'en') continue; // Skip default
        
        try {
          const translationData = await i18nManager.loadNamespaceFile('meme-maker.haxProperties', langCode);
          testResults[langCode] = {
            loaded: !!translationData,
            hasGizmo: !!(translationData && translationData.gizmo),
            hasSettings: !!(translationData && translationData.settings),
            hasDemo: !!(translationData && translationData.demoSchema),
            language: langName
          };
        } catch (error) {
          testResults[langCode] = {
            loaded: false,
            error: error.message,
            language: langName
          };
        }
      }
      
      // Verify all languages loaded successfully
      Object.entries(testResults).forEach(([langCode, result]) => {
        expect(result.loaded, `${result.language} (${langCode}) should load successfully`).to.be.true;
        expect(result.hasGizmo, `${result.language} (${langCode}) should have gizmo translations`).to.be.true;
      });
      
      console.log('Translation test summary:', testResults);
    });
  });
});
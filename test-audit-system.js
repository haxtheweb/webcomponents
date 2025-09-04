#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Parse a JavaScript file to extract component properties, slots, events, and methods
 */
function analyzeComponent(elementPath, elementName) {
  const jsFilePath = path.join(elementPath, `${elementName}.js`);
  
  if (!fs.existsSync(jsFilePath)) {
    return {
      error: `Main JS file not found: ${jsFilePath}`,
      properties: [],
      slots: [],
      events: [],
      methods: []
    };
  }

  const content = fs.readFileSync(jsFilePath, 'utf8');
  
  const analysis = {
    properties: [],
    slots: [],
    events: [],
    methods: [],
    hasHaxProperties: false,
    extendsLitElement: false,
    extendsOtherBehaviors: []
  };

  try {
    // Extract properties from static get properties()
    const propertiesMatch = content.match(/static\s+get\s+properties\s*\(\s*\)\s*\{[\s\S]*?return\s*\{([\s\S]*?)\}\s*;?\s*\}/);
    if (propertiesMatch) {
      const propertiesBlock = propertiesMatch[1];
      
      // Parse individual properties
      const propertyMatches = propertiesBlock.matchAll(/(\w+)\s*:\s*\{([^}]*)\}/g);
      for (const match of propertyMatches) {
        const propName = match[1];
        const propConfig = match[2];
        
        let type = 'String'; // default
        let attribute = null;
        let defaultValue = null;
        
        const typeMatch = propConfig.match(/type\s*:\s*(\w+)/);
        if (typeMatch) type = typeMatch[1];
        
        const attributeMatch = propConfig.match(/attribute\s*:\s*["']([^"']+)["']/);
        if (attributeMatch) attribute = attributeMatch[1];
        
        analysis.properties.push({
          name: propName,
          type,
          attribute,
          config: propConfig.trim()
        });
      }
    }

    // Extract default values from constructor
    const constructorMatch = content.match(/constructor\s*\(\s*\)\s*\{([\s\S]*?)\}/);
    if (constructorMatch) {
      const constructorBody = constructorMatch[1];
      analysis.properties.forEach(prop => {
        const defaultMatch = constructorBody.match(new RegExp(`this\\.${prop.name}\\s*=\\s*([^;]+);`));
        if (defaultMatch) {
          prop.defaultValue = defaultMatch[1].trim();
        }
      });
    }

    // Look for slots in render method
    const renderMatch = content.match(/render\s*\(\s*\)\s*\{[\s\S]*?return\s+html`([\s\S]*?)`;?\s*\}/);
    if (renderMatch) {
      const template = renderMatch[1];
      
      // Find slot elements
      const slotMatches = template.matchAll(/<slot(?:\s+name=["']([^"']+)["'])?[^>]*>/g);
      for (const match of slotMatches) {
        const slotName = match[1] || 'default';
        if (!analysis.slots.includes(slotName)) {
          analysis.slots.push(slotName);
        }
      }
    }

    // Look for event dispatching
    const eventMatches = content.matchAll(/(?:this\.)?dispatchEvent\s*\(\s*new\s+(?:CustomEvent|Event)\s*\(\s*["']([^"']+)["']/g);
    for (const match of eventMatches) {
      if (!analysis.events.includes(match[1])) {
        analysis.events.push(match[1]);
      }
    }

    // Check for fire/fireEvent methods (common pattern)
    const fireMatches = content.matchAll(/(?:this\.)?fire(?:Event)?\s*\(\s*["']([^"']+)["']/g);
    for (const match of fireMatches) {
      if (!analysis.events.includes(match[1])) {
        analysis.events.push(match[1]);
      }
    }

    // Check if it has haxProperties
    analysis.hasHaxProperties = content.includes('haxProperties') || content.includes('getHaxProperties');

    // Check inheritance
    analysis.extendsLitElement = content.includes('extends LitElement') || content.includes('extends') && content.includes('LitElement');
    
    // Look for behavior mixins
    const behaviorMatches = content.matchAll(/extends\s+(\w+)\s*\(/g);
    for (const match of behaviorMatches) {
      analysis.extendsOtherBehaviors.push(match[1]);
    }

    // Extract public methods (non-private/protected)
    const methodMatches = content.matchAll(/(?:^|\n)\s*([a-zA-Z][a-zA-Z0-9]*)\s*\([^)]*\)\s*\{/g);
    for (const match of methodMatches) {
      const methodName = match[1];
      // Skip constructor, render, and common lifecycle methods, and private methods
      if (!methodName.startsWith('_') && 
          !['constructor', 'render', 'updated', 'firstUpdated', 'connectedCallback', 'disconnectedCallback', 'get', 'set', 'static'].includes(methodName)) {
        if (!analysis.methods.includes(methodName)) {
          analysis.methods.push(methodName);
        }
      }
    }

  } catch (error) {
    analysis.error = `Error parsing component: ${error.message}`;
  }

  return analysis;
}

/**
 * Analyze existing test file
 */
function analyzeExistingTest(elementPath, elementName) {
  const testFilePath = path.join(elementPath, 'test', `${elementName}.test.js`);
  
  if (!fs.existsSync(testFilePath)) {
    return {
      exists: false,
      hasAccessibilityTests: false,
      testedProperties: [],
      testedSlots: [],
      testedEvents: [],
      testedMethods: []
    };
  }

  const content = fs.readFileSync(testFilePath, 'utf8');
  
  return {
    exists: true,
    hasAccessibilityTests: content.includes('to.be.accessible()'),
    hasPropertyTests: content.includes('Property type validation') || content.includes('property'),
    hasAttributeTests: content.includes('Attribute') || content.includes('attribute'),
    hasSlotTests: content.includes('slot'),
    hasEventTests: content.includes('dispatchEvent') || content.includes('fire'),
    hasMethodTests: content.includes('method'),
    content: content
  };
}

/**
 * Generate test improvement recommendations
 */
function generateRecommendations(componentAnalysis, testAnalysis, elementName) {
  const recommendations = [];

  if (!testAnalysis.exists) {
    recommendations.push({
      priority: 'HIGH',
      type: 'MISSING_TEST_FILE',
      message: `No test file found. Create test/\${elementName}.test.js`
    });
    return recommendations;
  }

  if (!testAnalysis.hasAccessibilityTests) {
    recommendations.push({
      priority: 'HIGH',
      type: 'MISSING_A11Y_TESTS',
      message: 'Add accessibility tests using await expect(element).shadowDom.to.be.accessible()'
    });
  }

  if (componentAnalysis.properties.length > 0 && !testAnalysis.hasPropertyTests) {
    recommendations.push({
      priority: 'HIGH',
      type: 'MISSING_PROPERTY_TESTS',
      message: `Add comprehensive property tests for: ${componentAnalysis.properties.map(p => p.name).join(', ')}`
    });
  }

  if (componentAnalysis.slots.length > 0 && !testAnalysis.hasSlotTests) {
    recommendations.push({
      priority: 'MEDIUM',
      type: 'MISSING_SLOT_TESTS',
      message: `Add slot tests for: ${componentAnalysis.slots.join(', ')}`
    });
  }

  if (componentAnalysis.events.length > 0 && !testAnalysis.hasEventTests) {
    recommendations.push({
      priority: 'MEDIUM',
      type: 'MISSING_EVENT_TESTS',
      message: `Add event tests for: ${componentAnalysis.events.join(', ')}`
    });
  }

  // Check for attributes that should have tests
  const attributeProps = componentAnalysis.properties.filter(p => p.attribute);
  if (attributeProps.length > 0 && !testAnalysis.hasAttributeTests) {
    recommendations.push({
      priority: 'HIGH',
      type: 'MISSING_ATTRIBUTE_TESTS',
      message: `Add attribute-to-property mapping tests for: ${attributeProps.map(p => p.attribute).join(', ')}`
    });
  }

  return recommendations;
}

/**
 * Main audit function
 */
function auditElement(elementName) {
  const elementPath = path.join(__dirname, 'elements', elementName);
  
  if (!fs.existsSync(elementPath)) {
    return {
      element: elementName,
      error: `Element directory not found: ${elementPath}`
    };
  }

  const componentAnalysis = analyzeComponent(elementPath, elementName);
  const testAnalysis = analyzeExistingTest(elementPath, elementName);
  const recommendations = generateRecommendations(componentAnalysis, testAnalysis, elementName);

  return {
    element: elementName,
    component: componentAnalysis,
    tests: testAnalysis,
    recommendations,
    needsWork: recommendations.length > 0,
    priority: recommendations.some(r => r.priority === 'HIGH') ? 'HIGH' : 
              recommendations.length > 0 ? 'MEDIUM' : 'LOW'
  };
}

/**
 * Audit all elements
 */
function auditAllElements() {
  const elementsDir = path.join(__dirname, 'elements');
  const elements = fs.readdirSync(elementsDir).filter(item => {
    const itemPath = path.join(elementsDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

  const results = {
    summary: {
      total: elements.length,
      needsWork: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0
    },
    elements: {}
  };

  elements.forEach(element => {
    const audit = auditElement(element);
    results.elements[element] = audit;
    
    if (audit.needsWork) {
      results.summary.needsWork++;
      if (audit.priority === 'HIGH') results.summary.highPriority++;
      else if (audit.priority === 'MEDIUM') results.summary.mediumPriority++;
      else results.summary.lowPriority++;
    }
  });

  return results;
}

/**
 * Generate prioritized work list
 */
function generateWorkList(auditResults) {
  const workList = [];
  
  // High priority items first
  Object.keys(auditResults.elements)
    .filter(element => auditResults.elements[element].priority === 'HIGH')
    .sort()
    .forEach(element => {
      workList.push({
        element,
        priority: 'HIGH',
        recommendations: auditResults.elements[element].recommendations
      });
    });

  // Medium priority items
  Object.keys(auditResults.elements)
    .filter(element => auditResults.elements[element].priority === 'MEDIUM')
    .sort()
    .forEach(element => {
      workList.push({
        element,
        priority: 'MEDIUM', 
        recommendations: auditResults.elements[element].recommendations
      });
    });

  return workList;
}

// Export functions for use in other scripts
module.exports = {
  auditElement,
  auditAllElements,
  analyzeComponent,
  analyzeExistingTest,
  generateRecommendations,
  generateWorkList
};

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Auditing all elements...');
    const results = auditAllElements();
    const workList = generateWorkList(results);
    
    console.log('\n='.repeat(80));
    console.log('WEBCOMPONENTS TEST AUDIT SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Elements: ${results.summary.total}`);
    console.log(`Need Work: ${results.summary.needsWork}`);
    console.log(`High Priority: ${results.summary.highPriority}`);
    console.log(`Medium Priority: ${results.summary.mediumPriority}`);
    console.log(`Low Priority: ${results.summary.lowPriority}`);
    
    console.log('\nWORK LIST (first 20):');
    console.log('-'.repeat(40));
    workList.slice(0, 20).forEach((item, index) => {
      console.log(`${index + 1}. [${item.priority}] ${item.element}`);
      item.recommendations.forEach(rec => {
        console.log(`   • ${rec.message}`);
      });
      console.log();
    });
    
    // Save detailed results
    fs.writeFileSync('test-audit-results.json', JSON.stringify(results, null, 2));
    fs.writeFileSync('test-work-list.json', JSON.stringify(workList, null, 2));
    console.log('Detailed results saved to test-audit-results.json');
    console.log('Work list saved to test-work-list.json');
    
  } else {
    // Audit specific element
    const elementName = args[0];
    const result = auditElement(elementName);
    console.log(JSON.stringify(result, null, 2));
  }
}

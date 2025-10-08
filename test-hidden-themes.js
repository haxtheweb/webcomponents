#!/usr/bin/env node

// Test to verify hidden themes are properly filtered
async function testHiddenThemes() {
  console.log('🔍 Testing hidden themes filtering...');
  
  try {
    const themesUrl = 'http://localhost:8080/elements/haxcms-elements/lib/themes.json';
    
    const response = await fetch(themesUrl);
    if (!response.ok) {
      throw new Error(`Failed to load themes: ${response.status}`);
    }
    
    const themesData = await response.json();
    const allThemes = Object.values(themesData);
    const hiddenThemes = allThemes.filter(theme => theme.hidden);
    const visibleThemes = allThemes.filter(theme => !theme.hidden);
    const terribleThemes = allThemes.filter(theme => theme.terrible);
    
    console.log(`📄 Total themes: ${allThemes.length}`);
    console.log(`🫥 Hidden themes: ${hiddenThemes.length}`);
    console.log(`👁️ Visible themes: ${visibleThemes.length}`);
    console.log(`💀 Terrible themes: ${terribleThemes.length}`);
    
    console.log('\n🫥 Hidden themes list:');
    hiddenThemes.forEach(theme => {
      console.log(`  - ${theme.element}: ${theme.name}`);
    });
    
    console.log('\n💀 Terrible themes list:');
    terribleThemes.forEach(theme => {
      console.log(`  - ${theme.element}: ${theme.name}`);
    });
    
    // Verify expected hidden themes
    const expectedHidden = ['haxcms-json-theme', 'haxcms-blank-theme', 'haxcms-print-theme'];
    const actualHidden = hiddenThemes.map(theme => theme.element);
    
    const correctHidden = expectedHidden.every(expected => 
      actualHidden.includes(expected)
    );
    
    console.log(`\n${correctHidden ? '✅' : '❌'} Expected hidden themes correctly marked: ${correctHidden}`);
    
    // Verify terrible themes have the flag
    const terribleCheck = terribleThemes.every(theme => 
      theme.element.includes('terrible')
    );
    
    console.log(`${terribleCheck ? '✅' : '❌'} Terrible themes correctly flagged: ${terribleCheck}`);
    
    console.log('🎉 Hidden themes test completed!');
    return correctHidden && terribleCheck;
    
  } catch (error) {
    console.error('❌ Hidden themes test failed:', error.message);
    return false;
  }
}

// Run the test
testHiddenThemes().then(success => {
  process.exit(success ? 0 : 1);
});